import { Request, Response } from 'express';
import { DeletePostUseCase } from '../../application/DeletePostUseCase';

export class DeletePostController {
  constructor(private deletePostUseCase: DeletePostUseCase) {}

  async execute(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params['id'] as string);
      if (isNaN(id)) { res.status(400).json({ error: 'ID invalido' }); return; }
      await this.deletePostUseCase.execute(id, req.userId!);
      res.status(200).json({ message: 'Post eliminado' });
    } catch (error) {
      res.status(400).json({ error: error instanceof Error ? error.message : 'Error interno' });
    }
  }
}