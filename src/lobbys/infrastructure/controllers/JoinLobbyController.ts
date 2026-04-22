import { Request, Response } from 'express';
import { JoinLobbyUseCase } from '../../application/JoinLobbyUseCase';
import { GetLobbyByIdUseCase } from '../../application/GetLobbyByIdUseCase';
import { createNotificationUseCase } from '../../../notifications/infrastructure/dependencies';
import { sendNotificationToUser } from '../../../notifications/infrastructure/socket/notificationSocket';
import { io } from '../../../../main';

export class JoinLobbyController {
  constructor(
    private joinLobbyUseCase: JoinLobbyUseCase,
    private getLobbyByIdUseCase: GetLobbyByIdUseCase,
  ) {}

  async execute(req: Request, res: Response): Promise<void> {
    try {
      const lobby_id = parseInt(req.params['id'] as string);
      if (isNaN(lobby_id)) { res.status(400).json({ error: 'ID invalido' }); return; }

      const member = await this.joinLobbyUseCase.execute(lobby_id, req.userId!);
      const lobby = await this.getLobbyByIdUseCase.execute(lobby_id);

      const notification = await createNotificationUseCase.execute(
        lobby.owner_id,
        'lobby_join',
        { lobby_id: lobby.id, lobby_name: lobby.name, user_id: req.userId }
      );
      sendNotificationToUser(io, lobby.owner_id, {
        ...notification,
        createdAt: notification.createdAt.toISOString(),
      });

      res.status(201).json({
        message: 'Te uniste al lobby',
        member: { ...member, joinedAt: member.joinedAt.toISOString() },
      });
    } catch (error) {
      res.status(400).json({ error: error instanceof Error ? error.message : 'Error interno' });
    }
  }
}