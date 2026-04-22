import { Request, Response } from 'express';
import { CreatePostUseCase } from '../../application/CreatePostUseCase';
import { createNotificationUseCase } from '../../../notifications/infrastructure/dependencies';
import { sendNotificationToUser } from '../../../notifications/infrastructure/socket/notificationSocket';
import { io } from '../../../../main';
import pool from '../../../core/config/conn';
import { RowDataPacket } from 'mysql2';

export class CreatePostController {
  constructor(private createPostUseCase: CreatePostUseCase) {}

  async execute(req: Request, res: Response): Promise<void> {
    try {
      const user_id = req.userId!;
      const { description, lobby_id } = req.body;

      const post = await this.createPostUseCase.execute(user_id, {
        description,
        lobby_id: lobby_id ? parseInt(lobby_id) : undefined,
      });

      if (post.lobby_id) {
        const [members] = await pool.execute<RowDataPacket[]>(
          'SELECT user_id FROM lobby_members WHERE lobby_id = ? AND user_id != ?',
          [post.lobby_id, user_id]
        );

        for (const member of members) {
          const notification = await createNotificationUseCase.execute(
            member.user_id,
            'new_post',
            { post_id: post.id, lobby_id: post.lobby_id, author_id: user_id }
          );
          sendNotificationToUser(io, member.user_id, {
            ...notification,
            createdAt: notification.createdAt.toISOString(),
          });
        }
      }

      res.status(201).json({
        message: 'Post creado exitosamente',
        post: { ...post, createdAt: post.createdAt.toISOString() },
      });
    } catch (error) {
      res.status(400).json({ error: error instanceof Error ? error.message : 'Error interno' });
    }
  }
}