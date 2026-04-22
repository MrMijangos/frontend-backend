import { Request, Response } from 'express';
import { UpdateUserUseCase } from '../../application/UpdateUserUseCase';
import { UpdateUserRequest } from '../../domain/dto/UserRequest';
import { uploadUserImage } from '../../../core/upload/uploadUser';

export class UpdateUserController {
  constructor(private updateUserUseCase: UpdateUserUseCase) {}

  async execute(req: Request, res: Response): Promise<void> {
    uploadUserImage(req, res, async (err) => {
      if (err) { res.status(400).json({ error: err.message }); return; }

      try {
        const id = parseInt(req.params["id"] as string);
        if (isNaN(id)) { res.status(400).json({ error: 'ID invalido' }); return; }

        const updateRequest: UpdateUserRequest = req.body;
        if (!updateRequest.name || !updateRequest.lastname || !updateRequest.email) {
          res.status(400).json({ error: 'Campos obligatorios: name, lastname, email' });
          return;
        }

        if (req.file) {
          updateRequest.profile_picture = `uploads/users/${req.file.filename}`;
        }

        const user = await this.updateUserUseCase.execute(id, updateRequest);

        res.status(200).json({
          message: 'Usuario actualizado exitosamente',
          user: {
            id: user.id, name: user.name, secondname: user.secondname,
            lastname: user.lastname, secondlastname: user.secondlastname,
            email: user.email, profile_picture: user.profile_picture,
            createdAt: user.createdAt.toISOString(),
          },
        });
      } catch (error) {
        res.status(400).json({ error: error instanceof Error ? error.message : 'Error interno' });
      }
    });
  }
}