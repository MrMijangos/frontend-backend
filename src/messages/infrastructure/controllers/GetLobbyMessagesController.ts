import { Request, Response } from 'express';
import { GetLobbyMessagesUseCase } from '../../application/GetLobbyMessagesUseCase';

export class GetLobbyMessagesController {
  constructor(private getLobbyMessagesUseCase: GetLobbyMessagesUseCase) {}

  async execute(req: Request, res: Response): Promise<void> {
    try {
      const lobby_id = parseInt(req.params["id"] as string);
      if (isNaN(lobby_id)) { res.status(400).json({ error: 'ID invalido' }); return; }

      const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;
      const messages = await this.getLobbyMessagesUseCase.execute(lobby_id, limit);

      res.status(200).json({
        messages: messages.map(m => ({ ...m, sentAt: m.sentAt.toISOString() })),
      });
    } catch (error) {
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }
}