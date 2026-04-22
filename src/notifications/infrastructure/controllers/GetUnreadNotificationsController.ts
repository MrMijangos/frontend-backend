import { Request, Response } from 'express';
import { GetUnreadNotificationsUseCase } from '../../application/GetUnreadNotificationsUseCase';

export class GetUnreadNotificationsController {
  constructor(private getUnreadNotificationsUseCase: GetUnreadNotificationsUseCase) {}

  async execute(req: Request, res: Response): Promise<void> {
    try {
      const notifications = await this.getUnreadNotificationsUseCase.execute(req.userId!);
      res.status(200).json({
        notifications: notifications.map(n => ({ ...n, createdAt: n.createdAt.toISOString() })),
        count: notifications.length,
      });
    } catch {
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }
}