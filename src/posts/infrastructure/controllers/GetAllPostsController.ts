import { Request, Response } from 'express';
import { GetAllPostsUseCase } from '../../application/GetAllPostsUseCase';

export class GetAllPostsController {
  constructor(private getAllPostsUseCase: GetAllPostsUseCase) {}

  async execute(_req: Request, res: Response): Promise<void> {
    try {
      const posts = await this.getAllPostsUseCase.execute();
      res.status(200).json({ posts: posts.map(p => ({ ...p, createdAt: p.createdAt.toISOString() })) });
    } catch {
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }
}