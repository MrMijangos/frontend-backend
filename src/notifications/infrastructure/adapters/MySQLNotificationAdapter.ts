import { INotificationRepository } from '../../domain/INotificationRepository';
import { Notification } from '../../domain/entities/Notification';
import pool from '../../../core/config/conn';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export class MySQLNotificationRepository implements INotificationRepository {
  async save(notification: Omit<Notification, 'id' | 'createdAt'>): Promise<Notification> {
    const [result] = await pool.execute<ResultSetHeader>(
      `INSERT INTO notifications (user_id, type, payload, is_read, created_at)
       VALUES (?, ?, ?, 0, NOW())`,
      [
        notification.user_id,
        notification.type,
        notification.payload ? JSON.stringify(notification.payload) : null,
      ]
    );
    const [rows] = await pool.execute<RowDataPacket[]>(
      'SELECT * FROM notifications WHERE id = ?', [result.insertId]
    );
    return this.mapRow(rows[0]);
  }

  async getByUser(user_id: number): Promise<Notification[]> {
    const [rows] = await pool.execute<RowDataPacket[]>(
      'SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC',
      [user_id]
    );
    return rows.map(row => this.mapRow(row));
  }

  async getUnreadByUser(user_id: number): Promise<Notification[]> {
    const [rows] = await pool.execute<RowDataPacket[]>(
      'SELECT * FROM notifications WHERE user_id = ? AND is_read = 0 ORDER BY created_at DESC',
      [user_id]
    );
    return rows.map(row => this.mapRow(row));
  }

  async markAsRead(id: number, user_id: number): Promise<void> {
    const [result] = await pool.execute<ResultSetHeader>(
      'UPDATE notifications SET is_read = 1 WHERE id = ? AND user_id = ?',
      [id, user_id]
    );
    if (result.affectedRows === 0) throw new Error('Notificación no encontrada');
  }

  async markAllAsRead(user_id: number): Promise<void> {
    await pool.execute(
      'UPDATE notifications SET is_read = 1 WHERE user_id = ? AND is_read = 0',
      [user_id]
    );
  }

  async delete(id: number, user_id: number): Promise<void> {
    const [result] = await pool.execute<ResultSetHeader>(
      'DELETE FROM notifications WHERE id = ? AND user_id = ?',
      [id, user_id]
    );
    if (result.affectedRows === 0) throw new Error('Notificación no encontrada');
  }

  private mapRow(row: RowDataPacket): Notification {
    return {
      id: row.id,
      user_id: row.user_id,
      type: row.type,
      payload: row.payload ? (typeof row.payload === 'string' ? JSON.parse(row.payload) : row.payload) : null,
      is_read: row.is_read === 1,
      createdAt: new Date(row.created_at),
    };
  }
}