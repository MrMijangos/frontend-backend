import { Request, Response } from 'express';
import { CreateLobbyUseCase } from '../../application/CreateLobbyUseCase';
import { uploadLobbyImage } from '../../../core/upload/uploadLobby';

export class CreateLobbyController {
  constructor(private createLobbyUseCase: CreateLobbyUseCase) {}

  async execute(req: Request, res: Response): Promise<void> {
    uploadLobbyImage(req, res, async (err) => {
      if (err) { res.status(400).json({ error: err.message }); return; }
      try {
        const owner_id = req.userId!;
        const request = req.body;

        if (!request.name) { res.status(400).json({ error: 'El nombre es obligatorio' }); return; }
        if (req.file) request.image = `uploads/lobbys/${req.file.filename}`;

        const lobby = await this.createLobbyUseCase.execute(owner_id, request);
        res.status(201).json({ message: 'Lobby creado exitosamente', lobby: this.toResponse(lobby) });
      } catch (error) {
        res.status(400).json({ error: error instanceof Error ? error.message : 'Error interno' });
      }
    });
  }

  private toResponse(lobby: any) {
    return { ...lobby, createdAt: lobby.createdAt.toISOString() };
  }
}