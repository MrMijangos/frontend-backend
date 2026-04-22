import { Request, Response } from 'express';
import { DeleteNotificationUseCase } from '../../application/DeleteNotificationUseCase';

export class DeleteNotificationController {
  constructor(private deleteNotificationUseCase: DeleteNotificationUseCase) {}

  async execute(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params['id'] as string);
      if (isNaN(id)) { res.status(400).json({ error: 'ID invalido' }); return; }
      await this.deleteNotificationUseCase.execute(id, req.userId!);
      res.status(200).json({ message: 'Notificación eliminada' });
    } catch (error) {
      res.status(400).json({ error: error instanceof Error ? error.message : 'Error interno' });
    }
  }
}