import { Request, Response } from 'express';
import { GetPostImagesUseCase } from '../../application/GetPostImagesUseCase';

export class GetPostImagesController {
  constructor(private getPostImagesUseCase: GetPostImagesUseCase) {}

  async execute(req: Request, res: Response): Promise<void> {
    try {
      const post_id = parseInt(req.params['id'] as string);
      if (isNaN(post_id)) { res.status(400).json({ error: 'ID invalido' }); return; }
      const images = await this.getPostImagesUseCase.execute(post_id);
      res.status(200).json({ images });
    } catch {
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }
}