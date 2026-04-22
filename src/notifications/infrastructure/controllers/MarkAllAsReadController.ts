import { Request, Response } from 'express';
import { MarkAllAsReadUseCase } from '../../application/MarkAllAsReadUseCase';

export class MarkAllAsReadController {
  constructor(private markAllAsReadUseCase: MarkAllAsReadUseCase) {}

  async execute(req: Request, res: Response): Promise<void> {
    try {
      await this.markAllAsReadUseCase.execute(req.userId!);
      res.status(200).json({ message: 'Todas las notificaciones marcadas como leídas' });
    } catch {
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }
}