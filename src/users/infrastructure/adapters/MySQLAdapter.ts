import { IUserRepository } from '../../domain/IUserRepository';
import { User } from '../../domain/entities/User';
import pool from '../../../core/config/conn';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export class MySQLUserRepository implements IUserRepository {
  async save(user: Omit<User, 'id' | 'createdAt'>): Promise<User> {
    const query = `
      INSERT INTO users (name, secondname, lastname, secondlastname, email, password, profile_picture, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, NOW())
    `;
    const [result] = await pool.execute<ResultSetHeader>(query, [
      user.name, user.secondname, user.lastname, user.secondlastname,
      user.email, user.password, user.profile_picture ?? null,
    ]);
    const [rows] = await pool.execute<RowDataPacket[]>('SELECT * FROM users WHERE id = ?', [result.insertId]);
    return this.mapRow(rows[0]);
  }

  async getByEmail(email: string): Promise<User | null> {
    const [rows] = await pool.execute<RowDataPacket[]>('SELECT * FROM users WHERE email = ?', [email]);
    if (rows.length === 0) return null;
    return this.mapRow(rows[0]);
  }

  async getByID(id: number): Promise<User | null> {
    const [rows] = await pool.execute<RowDataPacket[]>('SELECT * FROM users WHERE id = ?', [id]);
    if (rows.length === 0) return null;
    return this.mapRow(rows[0]);
  }

  async getAll(): Promise<User[]> {
    const [rows] = await pool.execute<RowDataPacket[]>('SELECT * FROM users ORDER BY created_at DESC');
    return rows.map(row => this.mapRow(row));
  }

  async update(user: User): Promise<void> {
    const query = `
      UPDATE users
      SET name = ?, secondname = ?, lastname = ?, secondlastname = ?, email = ?, password = ?, profile_picture = ?
      WHERE id = ?
    `;
    const [result] = await pool.execute<ResultSetHeader>(query, [
      user.name, user.secondname, user.lastname, user.secondlastname,
      user.email, user.password, user.profile_picture ?? null, user.id,
    ]);
    if (result.affectedRows === 0) throw new Error('Usuario no encontrado');
  }

  async delete(id: number): Promise<void> {
    const [result] = await pool.execute<ResultSetHeader>('DELETE FROM users WHERE id = ?', [id]);
    if (result.affectedRows === 0) throw new Error('Usuario no encontrado');
  }

  async getTotal(): Promise<number> {
    const [rows] = await pool.execute<RowDataPacket[]>('SELECT COUNT(*) as total FROM users');
    return rows[0].total;
  }

  private mapRow(row: RowDataPacket): User {
    return {
      id: row.id,
      name: row.name,
      secondname: row.secondname ?? null,
      lastname: row.lastname,
      secondlastname: row.secondlastname ?? null,
      email: row.email,
      password: row.password,
      profile_picture: row.profile_picture ?? null,
      createdAt: new Date(row.created_at),
    };
  }
}