import { Request, Response } from 'express';
import { JoinLobbyUseCase } from '../../application/JoinLobbyUseCase';

export class JoinLobbyController {
  constructor(private joinLobbyUseCase: JoinLobbyUseCase) {}

  async execute(req: Request, res: Response): Promise<void> {
    try {
      const lobby_id = parseInt(req.params["id"] as string);
      if (isNaN(lobby_id)) { res.status(400).json({ error: 'ID invalido' }); return; }
      const member = await this.joinLobbyUseCase.execute(lobby_id, req.userId!);
      res.status(201).json({ message: 'Te uniste al lobby', member: { ...member, joinedAt: member.joinedAt.toISOString() } });
    } catch (error) {
      res.status(400).json({ error: error instanceof Error ? error.message : 'Error interno' });
    }
  }
}