import { Request, Response } from 'express';
import { GetLobbysByOwnerUseCase } from '../../application/GetLobbysByOwnerUseCase';

export class GetLobbysByOwnerController {
  constructor(private getLobbysByOwnerUseCase: GetLobbysByOwnerUseCase) {}

  async execute(req: Request, res: Response): Promise<void> {
    try {
      const owner_id = req.userId!;
      const lobbys = await this.getLobbysByOwnerUseCase.execute(owner_id);
      res.status(200).json({ lobbys: lobbys.map(l => ({ ...l, createdAt: l.createdAt.toISOString() })) });
    } catch {
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }
}