import { Request, Response } from 'express';
import { DeleteLobbyUseCase } from '../../application/DeleteLobbyUseCase';

export class DeleteLobbyController {
  constructor(private deleteLobbyUseCase: DeleteLobbyUseCase) {}

  async execute(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params["id"] as string);
      if (isNaN(id)) { res.status(400).json({ error: 'ID invalido' }); return; }
      await this.deleteLobbyUseCase.execute(id, req.userId!);
      res.status(200).json({ message: 'Lobby eliminado exitosamente' });
    } catch (error) {
      res.status(400).json({ error: error instanceof Error ? error.message : 'Error interno' });
    }
  }
}