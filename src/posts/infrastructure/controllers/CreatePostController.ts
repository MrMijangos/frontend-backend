import { Request, Response } from 'express';
import { CreatePostUseCase } from '../../application/CreatePostUseCase';

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

      res.status(201).json({ message: 'Post creado exitosamente', post: this.toResponse(post) });
    } catch (error) {
      res.status(400).json({ error: error instanceof Error ? error.message : 'Error interno' });
    }
  }

  private toResponse(post: any) {
    return { ...post, createdAt: post.createdAt.toISOString() };
  }
}