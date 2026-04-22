import { Request, Response } from 'express';
import { GetLobbyMembersUseCase } from '../../application/GetLobbyMembersUseCase';

export class GetLobbyMembersController {
  constructor(private getLobbyMembersUseCase: GetLobbyMembersUseCase) {}

  async execute(req: Request, res: Response): Promise<void> {
    try {
      const lobby_id = parseInt(req.params["id"] as string);
      if (isNaN(lobby_id)) { res.status(400).json({ error: 'ID invalido' }); return; }
      const members = await this.getLobbyMembersUseCase.execute(lobby_id);
      res.status(200).json({ members: members.map(m => ({ ...m, joinedAt: m.joinedAt.toISOString() })) });
    } catch (error) {
      res.status(404).json({ error: error instanceof Error ? error.message : 'Error interno' });
    }
  }
}