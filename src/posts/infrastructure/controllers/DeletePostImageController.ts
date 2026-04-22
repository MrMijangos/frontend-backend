import { Request, Response } from 'express';
import { DeletePostImageUseCase } from '../../application/DeletePostImageUseCase';

export class DeletePostImageController {
  constructor(private deletePostImageUseCase: DeletePostImageUseCase) {}

  async execute(req: Request, res: Response): Promise<void> {
    try {
      const post_id = parseInt(req.params['id'] as string);
      const image_id = parseInt(req.params['imageId'] as string);
      if (isNaN(post_id) || isNaN(image_id)) { res.status(400).json({ error: 'ID invalido' }); return; }

      await this.deletePostImageUseCase.execute(post_id, image_id, req.userId!);
      res.status(200).json({ message: 'Imagen eliminada' });
    } catch (error) {
      res.status(400).json({ error: error instanceof Error ? error.message : 'Error interno' });
    }
  }
}