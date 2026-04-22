import { Request, Response } from 'express';
import { AddPostImagesUseCase } from '../../application/AddPostImagesUseCase';
import { uploadPostImages } from '../../../core/upload/uploadPost';

export class AddPostImagesController {
  constructor(private addPostImagesUseCase: AddPostImagesUseCase) {}

  async execute(req: Request, res: Response): Promise<void> {
    uploadPostImages(req, res, async (err) => {
      if (err) { res.status(400).json({ error: err.message }); return; }

      try {
        const post_id = parseInt(req.params['id'] as string);
        if (isNaN(post_id)) { res.status(400).json({ error: 'ID invalido' }); return; }

        const files = req.files as Express.Multer.File[];
        if (!files || files.length === 0) {
          res.status(400).json({ error: 'Debes enviar al menos una imagen' });
          return;
        }

        const image_urls = files.map(f => `uploads/posts/${f.filename}`);
        const images = await this.addPostImagesUseCase.execute(post_id, req.userId!, image_urls);

        res.status(201).json({ message: 'Imágenes agregadas', images });
      } catch (error) {
        res.status(400).json({ error: error instanceof Error ? error.message : 'Error interno' });
      }
    });
  }
}