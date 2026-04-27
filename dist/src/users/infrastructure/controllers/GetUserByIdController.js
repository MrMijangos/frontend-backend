"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetUserByIdController = void 0;
class GetUserByIdController {
    constructor(getUserByIdUseCase) {
        this.getUserByIdUseCase = getUserByIdUseCase;
    }
    async execute(req, res) {
        try {
            const id = parseInt(req.params["id"]);
            if (isNaN(id)) {
                res.status(400).json({ error: 'ID invalido' });
                return;
            }
            const user = await this.getUserByIdUseCase.execute(id);
            res.status(200).json({
                user: {
                    id: user.id, name: user.name, secondname: user.secondname,
                    lastname: user.lastname, secondlastname: user.secondlastname,
                    email: user.email, profile_picture: user.profile_picture,
                    createdAt: user.createdAt.toISOString(),
                },
            });
        }
        catch (error) {
            res.status(404).json({ error: error instanceof Error ? error.message : 'Error interno' });
        }
    }
}
exports.GetUserByIdController = GetUserByIdController;
