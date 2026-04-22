import { IPostRepository } from '../../domain/IPostRepository';
import { Post } from '../../domain/entities/Post';
import pool from '../../../core/config/conn';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export class MySQLPostRepository implements IPostRepository {
  async save(post: Omit<Post, 'id' | 'createdAt'>): Promise<Post> {
    const [result] = await pool.execute<ResultSetHeader>(
      `INSERT INTO posts (user_id, lobby_id, description, created_at) VALUES (?, ?, ?, NOW())`,
      [post.user_id, post.lobby_id ?? null, post.description ?? null]
    );
    const [rows] = await pool.execute<RowDataPacket[]>('SELECT * FROM posts WHERE id = ?', [result.insertId]);
    return this.mapRow(rows[0]);
  }

  async getByID(id: number): Promise<Post | null> {
    const [rows] = await pool.execute<RowDataPacket[]>('SELECT * FROM posts WHERE id = ?', [id]);
    if (rows.length === 0) return null;
    return this.mapRow(rows[0]);
  }

  async getAll(): Promise<Post[]> {
    const [rows] = await pool.execute<RowDataPacket[]>('SELECT * FROM posts ORDER BY created_at DESC');
    return rows.map(row => this.mapRow(row));
  }

  async getByUser(user_id: number): Promise<Post[]> {
    const [rows] = await pool.execute<RowDataPacket[]>(
      'SELECT * FROM posts WHERE user_id = ? ORDER BY created_at DESC', [user_id]
    );
    return rows.map(row => this.mapRow(row));
  }

  async getByLobby(lobby_id: number): Promise<Post[]> {
    const [rows] = await pool.execute<RowDataPacket[]>(
      'SELECT * FROM posts WHERE lobby_id = ? ORDER BY created_at DESC', [lobby_id]
    );
    return rows.map(row => this.mapRow(row));
  }

  async update(post: Post): Promise<void> {
    const [result] = await pool.execute<ResultSetHeader>(
      'UPDATE posts SET description = ? WHERE id = ?',
      [post.description ?? null, post.id]
    );
    if (result.affectedRows === 0) throw new Error('Post no encontrado');
  }

  async delete(id: number): Promise<void> {
    const [result] = await pool.execute<ResultSetHeader>('DELETE FROM posts WHERE id = ?', [id]);
    if (result.affectedRows === 0) throw new Error('Post no encontrado');
  }

  private mapRow(row: RowDataPacket): Post {
    return {
      id: row.id,
      user_id: row.user_id,
      lobby_id: row.lobby_id ?? null,
      description: row.description ?? null,
      createdAt: new Date(row.created_at),
    };
  }
}