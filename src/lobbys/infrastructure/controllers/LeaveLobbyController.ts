import { Request, Response } from 'express';
import { LeaveLobbyUseCase } from '../../application/LeaveLobbyUseCase';

export class LeaveLobbyController {
  constructor(private leaveLobbyUseCase: LeaveLobbyUseCase) {}

  async execute(req: Request, res: Response): Promise<void> {
    try {
      const lobby_id = parseInt(req.params["id"] as string);
      if (isNaN(lobby_id)) { res.status(400).json({ error: 'ID invalido' }); return; }
      await this.leaveLobbyUseCase.execute(lobby_id, req.userId!);
      res.status(200).json({ message: 'Saliste del lobby' });
    } catch (error) {
      res.status(400).json({ error: error instanceof Error ? error.message : 'Error interno' });
    }
  }
}