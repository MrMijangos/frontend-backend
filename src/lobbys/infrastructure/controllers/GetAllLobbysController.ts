import { Request, Response } from 'express';
import { GetAllLobbysUseCase } from '../../application/GetAllLobbysUseCase';

export class GetAllLobbysController {
  constructor(private getAllLobbysUseCase: GetAllLobbysUseCase) {}

  async execute(_req: Request, res: Response): Promise<void> {
    try {
      const lobbys = await this.getAllLobbysUseCase.execute();
      res.status(200).json({ lobbys: lobbys.map(l => ({ ...l, createdAt: l.createdAt.toISOString() })) });
    } catch {
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }
}