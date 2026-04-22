import { IMessageRepository } from '../../domain/IMessageRepository';
import { Message } from '../../domain/entities/Message';
import pool from '../../../core/config/conn';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export class MySQLMessageRepository implements IMessageRepository {
  async save(message: Omit<Message, 'id' | 'sentAt'>): Promise<Message> {
    const [result] = await pool.execute<ResultSetHeader>(
      `INSERT INTO messages (lobby_id, user_id, content, sent_at) VALUES (?, ?, ?, NOW())`,
      [message.lobby_id, message.user_id, message.content]
    );
    const [rows] = await pool.execute<RowDataPacket[]>(
      'SELECT * FROM messages WHERE id = ?', [result.insertId]
    );
    return this.mapRow(rows[0]);
  }

  async getByLobby(lobby_id: number, limit = 50): Promise<Message[]> {
    const [rows] = await pool.execute<RowDataPacket[]>(
      `SELECT * FROM messages WHERE lobby_id = ? ORDER BY sent_at ASC LIMIT ?`,
      [lobby_id, limit]
    );
    return rows.map(row => this.mapRow(row));
  }

  async delete(id: number): Promise<void> {
    const [result] = await pool.execute<ResultSetHeader>(
      'DELETE FROM messages WHERE id = ?', [id]
    );
    if (result.affectedRows === 0) throw new Error('Mensaje no encontrado');
  }

  private mapRow(row: RowDataPacket): Message {
    return {
      id: row.id,
      lobby_id: row.lobby_id,
      user_id: row.user_id,
      content: row.content,
      sentAt: new Date(row.sent_at),
    };
  }
}