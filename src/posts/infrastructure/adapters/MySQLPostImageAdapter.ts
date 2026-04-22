import { IPostImageRepository } from '../../domain/IPostImageRepository';
import { PostImage } from '../../domain/entities/PostImage';
import pool from '../../../core/config/conn';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export class MySQLPostImageRepository implements IPostImageRepository {
  async saveMany(post_id: number, image_urls: string[]): Promise<PostImage[]> {
    const saved: PostImage[] = [];

    for (const url of image_urls) {
      const [result] = await pool.execute<ResultSetHeader>(
        'INSERT INTO post_images (post_id, image_url) VALUES (?, ?)',
        [post_id, url]
      );
      saved.push({ id: result.insertId, post_id, image_url: url });
    }

    return saved;
  }

  async getByPost(post_id: number): Promise<PostImage[]> {
    const [rows] = await pool.execute<RowDataPacket[]>(
      'SELECT * FROM post_images WHERE post_id = ?', [post_id]
    );
    return rows.map(row => ({ id: row.id, post_id: row.post_id, image_url: row.image_url }));
  }

  async delete(id: number): Promise<void> {
    const [result] = await pool.execute<ResultSetHeader>(
      'DELETE FROM post_images WHERE id = ?', [id]
    );
    if (result.affectedRows === 0) throw new Error('Imagen no encontrada');
  }

  async deleteByPost(post_id: number): Promise<void> {
    await pool.execute('DELETE FROM post_images WHERE post_id = ?', [post_id]);
  }
}