import { Request, Response } from 'express';
import { CreateUserUseCase } from '../../application/CreateUserUseCase';
import { UserRequest } from '../../domain/dto/UserRequest';
import { uploadUserImage } from '../../../core/upload/uploadUser';

export class CreateUserController {
  constructor(private createUserUseCase: CreateUserUseCase) {}

  async execute(req: Request, res: Response): Promise<void> {
    uploadUserImage(req, res, async (err) => {
      if (err) { res.status(400).json({ error: err.message }); return; }

      try {
        const userRequest: UserRequest = req.body;

        if (!userRequest.name || !userRequest.email || !userRequest.password) {
          res.status(400).json({ error: 'Campos obligatorios: name, email, password' });
          return;
        }

        if (req.file) {
          userRequest.profile_picture = `uploads/users/${req.file.filename}`;
        }

        const user = await this.createUserUseCase.execute(userRequest);

        res.status(201).json({
          message: 'Usuario creado exitosamente',
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