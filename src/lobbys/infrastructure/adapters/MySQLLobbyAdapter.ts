import { ILobbyRepository } from '../../domain/ILobbyRepository';
import { Lobby } from '../../domain/entities/Lobby';
import { LobbyMember } from '../../domain/entities/LobbyMember';
import pool from '../../../core/config/conn';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export class MySQLLobbyRepository implements ILobbyRepository {
  async save(lobby: Omit<Lobby, 'id' | 'createdAt'>): Promise<Lobby> {
    const query = `
      INSERT INTO lobbys (name, description, image, owner_id, created_at)
      VALUES (?, ?, ?, ?, NOW())
    `;
    const [result] = await pool.execute<ResultSetHeader>(query, [
      lobby.name, lobby.description, lobby.image, lobby.owner_id,
    ]);
    const [rows] = await pool.execute<RowDataPacket[]>('SELECT * FROM lobbys WHERE id = ?', [result.insertId]);
    return this.mapLobby(rows[0]);
  }

  async getByID(id: number): Promise<Lobby | null> {
    const [rows] = await pool.execute<RowDataPacket[]>('SELECT * FROM lobbys WHERE id = ?', [id]);
    if (rows.length === 0) return null;
    return this.mapLobby(rows[0]);
  }

  async getAll(): Promise<Lobby[]> {
    const [rows] = await pool.execute<RowDataPacket[]>('SELECT * FROM lobbys ORDER BY created_at DESC');
    return rows.map(row => this.mapLobby(row));
  }

  async getByOwner(owner_id: number): Promise<Lobby[]> {
    const [rows] = await pool.execute<RowDataPacket[]>(
      'SELECT * FROM lobbys WHERE owner_id = ? ORDER BY created_at DESC',
      [owner_id]
    );
    return rows.map(row => this.mapLobby(row));
  }

  async update(lobby: Lobby): Promise<void> {
    const query = `
      UPDATE lobbys SET name = ?, description = ?, image = ? WHERE id = ?
    `;
    const [result] = await pool.execute<ResultSetHeader>(query, [
      lobby.name, lobby.description, lobby.image, lobby.id,
    ]);
    if (result.affectedRows === 0) throw new Error('Lobby no encontrado');
  }

  async delete(id: number): Promise<void> {
    const [result] = await pool.execute<ResultSetHeader>('DELETE FROM lobbys WHERE id = ?', [id]);
    if (result.affectedRows === 0) throw new Error('Lobby no encontrado');
  }

  async addMember(lobby_id: number, user_id: number): Promise<LobbyMember> {
    const query = `INSERT INTO lobby_members (lobby_id, user_id, joined_at) VALUES (?, ?, NOW())`;
    const [result] = await pool.execute<ResultSetHeader>(query, [lobby_id, user_id]);
    const [rows] = await pool.execute<RowDataPacket[]>(
      'SELECT * FROM lobby_members WHERE id = ?', [result.insertId]
    );
    return this.mapMember(rows[0]);
  }

  async removeMember(lobby_id: number, user_id: number): Promise<void> {
    const [result] = await pool.execute<ResultSetHeader>(
      'DELETE FROM lobby_members WHERE lobby_id = ? AND user_id = ?',
      [lobby_id, user_id]
    );
    if (result.affectedRows === 0) throw new Error('Miembro no encontrado');
  }

  async getMembers(lobby_id: number): Promise<LobbyMember[]> {
    const [rows] = await pool.execute<RowDataPacket[]>(
      'SELECT * FROM lobby_members WHERE lobby_id = ? ORDER BY joined_at ASC',
      [lobby_id]
    );
    return rows.map(row => this.mapMember(row));
  }

  async isMember(lobby_id: number, user_id: number): Promise<boolean> {
    const [rows] = await pool.execute<RowDataPacket[]>(
      'SELECT id FROM lobby_members WHERE lobby_id = ? AND user_id = ?',
      [lobby_id, user_id]
    );
    return rows.length > 0;
  }

  private mapLobby(row: RowDataPacket): Lobby {
    return {
      id: row.id,
      name: row.name,
      description: row.description ?? null,
      image: row.image ?? null,
      owner_id: row.owner_id,
      createdAt: new Date(row.created_at),
    };
  }

  private mapMember(row: RowDataPacket): LobbyMember {
    return {
      id: row.id,
      lobby_id: row.lobby_id,
      user_id: row.user_id,
      joinedAt: new Date(row.joined_at),
    };
  }
}