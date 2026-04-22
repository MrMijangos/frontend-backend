import { Request, Response } from 'express';
import { UpdatePostUseCase } from '../../application/UpdatePostUseCase';

export class UpdatePostController {
  constructor(private updatePostUseCase: UpdatePostUseCase) {}

  async execute(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params['id'] as string);
      if (isNaN(id)) { res.status(400).json({ error: 'ID invalido' }); return; }
      const post = await this.updatePostUseCase.execute(id, req.userId!, req.body);
      res.status(200).json({ message: 'Post actualizado', post: { ...post, createdAt: post.createdAt.toISOString() } });
    } catch (error) {
      res.status(400).json({ error: error instanceof Error ? error.message : 'Error interno' });
    }
  }
}