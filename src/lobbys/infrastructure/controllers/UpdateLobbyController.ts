import { Request, Response } from 'express';
import { UpdateLobbyUseCase } from '../../application/UpdateLobbyUseCase';
import { uploadLobbyImage } from '../../../core/upload/uploadLobby';

export class UpdateLobbyController {
  constructor(private updateLobbyUseCase: UpdateLobbyUseCase) {}

  async execute(req: Request, res: Response): Promise<void> {
    uploadLobbyImage(req, res, async (err) => {
      if (err) { res.status(400).json({ error: err.message }); return; }
      try {
        const id = parseInt(req.params["id"] as string);
        if (isNaN(id)) { res.status(400).json({ error: 'ID invalido' }); return; }

        const owner_id = req.userId!;
        const request = req.body;
        if (req.file) request.image = `uploads/lobbys/${req.file.filename}`;

        const lobby = await this.updateLobbyUseCase.execute(id, owner_id, request);
        res.status(200).json({ message: 'Lobby actualizado exitosamente', lobby: { ...lobby, createdAt: lobby.createdAt.toISOString() } });
      } catch (error) {
        res.status(400).json({ error: error instanceof Error ? error.message : 'Error interno' });
      }
    });
  }
}