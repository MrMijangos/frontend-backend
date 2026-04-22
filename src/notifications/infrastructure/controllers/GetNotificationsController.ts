import { Request, Response } from 'express';
import { GetNotificationsUseCase } from '../../application/GetNotificationsUseCase';

export class GetNotificationsController {
  constructor(private getNotificationsUseCase: GetNotificationsUseCase) {}

  async execute(req: Request, res: Response): Promise<void> {
    try {
      const notifications = await this.getNotificationsUseCase.execute(req.userId!);
      res.status(200).json({
        notifications: notifications.map(n => ({ ...n, createdAt: n.createdAt.toISOString() })),
      });
    } catch {
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }
}