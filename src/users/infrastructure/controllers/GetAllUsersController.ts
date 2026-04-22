import { Request, Response } from 'express';
import { GetAllUsersUseCase } from '../../application/GetAllUsersUseCase';

export class GetAllUsersController {
  constructor(private getAllUsersUseCase: GetAllUsersUseCase) {}

  async execute(_req: Request, res: Response): Promise<void> {
    try {
      const users = await this.getAllUsersUseCase.execute();
      res.status(200).json({
        users: users.map(user => ({
          id: user.id, name: user.name, secondname: user.secondname,
          lastname: user.lastname, secondlastname: user.secondlastname,
          email: user.email, profile_picture: user.profile_picture,
          createdAt: user.createdAt.toISOString(),
        })),
      });
    } catch {
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }
}