"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetAllUsersController = void 0;
class GetAllUsersController {
    constructor(getAllUsersUseCase) {
        this.getAllUsersUseCase = getAllUsersUseCase;
    }
    async execute(_req, res) {
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
        }
        catch {
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    }
}
exports.GetAllUsersController = GetAllUsersController;
