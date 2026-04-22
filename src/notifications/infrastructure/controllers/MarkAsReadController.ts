import { Request, Response } from 'express';
import { MarkAsReadUseCase } from '../../application/MarkAsReadUseCase';

export class MarkAsReadController {
  constructor(private markAsReadUseCase: MarkAsReadUseCase) {}

  async execute(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params['id'] as string);
      if (isNaN(id)) { res.status(400).json({ error: 'ID invalido' }); return; }
      await this.markAsReadUseCase.execute(id, req.userId!);
      res.status(200).json({ message: 'Notificación marcada como leída' });
    } catch (error) {
      res.status(400).json({ error: error instanceof Error ? error.message : 'Error interno' });
    }
  }
}