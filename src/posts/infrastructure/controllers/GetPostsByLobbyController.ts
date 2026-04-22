import { Request, Response } from 'express';
import { GetPostsByLobbyUseCase } from '../../application/GetPostsByLobbyUseCase';

export class GetPostsByLobbyController {
  constructor(private getPostsByLobbyUseCase: GetPostsByLobbyUseCase) {}

  async execute(req: Request, res: Response): Promise<void> {
    try {
      const lobby_id = parseInt(req.params['id'] as string);
      if (isNaN(lobby_id)) { res.status(400).json({ error: 'ID invalido' }); return; }
      const posts = await this.getPostsByLobbyUseCase.execute(lobby_id);
      res.status(200).json({ posts: posts.map(p => ({ ...p, createdAt: p.createdAt.toISOString() })) });
    } catch {
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }
}