import { Request, Response } from 'express';
import { GetLobbyByIdUseCase } from '../../application/GetLobbyByIdUseCase';

export class GetLobbyByIdController {
  constructor(private getLobbyByIdUseCase: GetLobbyByIdUseCase) {}

  async execute(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params["id"] as string);
      if (isNaN(id)) { res.status(400).json({ error: 'ID invalido' }); return; }
      const lobby = await this.getLobbyByIdUseCase.execute(id);
      res.status(200).json({ lobby: { ...lobby, createdAt: lobby.createdAt.toISOString() } });
    } catch (error) {
      res.status(404).json({ error: error instanceof Error ? error.message : 'Error interno' });
    }
  }
}