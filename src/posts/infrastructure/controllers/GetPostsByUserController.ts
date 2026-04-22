import { Request, Response } from 'express';
import { GetPostsByUserUseCase } from '../../application/GetPostsByUserUseCase';

export class GetPostsByUserController {
  constructor(private getPostsByUserUseCase: GetPostsByUserUseCase) {}

  async execute(req: Request, res: Response): Promise<void> {
    try {
      const user_id = parseInt(req.params['id'] as string);
      if (isNaN(user_id)) { res.status(400).json({ error: 'ID invalido' }); return; }
      const posts = await this.getPostsByUserUseCase.execute(user_id);
      res.status(200).json({ posts: posts.map(p => ({ ...p, createdAt: p.createdAt.toISOString() })) });
    } catch {
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }
}