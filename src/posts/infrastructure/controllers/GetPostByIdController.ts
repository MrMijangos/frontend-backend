import { Request, Response } from 'express';
import { GetPostByIdUseCase } from '../../application/GetPostByIdUseCase';

export class GetPostByIdController {
  constructor(private getPostByIdUseCase: GetPostByIdUseCase) {}

  async execute(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params['id'] as string);
      if (isNaN(id)) { res.status(400).json({ error: 'ID invalido' }); return; }
      const post = await this.getPostByIdUseCase.execute(id);
      res.status(200).json({ post: { ...post, createdAt: post.createdAt.toISOString() } });
    } catch (error) {
      res.status(404).json({ error: error instanceof Error ? error.message : 'Error interno' });
    }
  }
}