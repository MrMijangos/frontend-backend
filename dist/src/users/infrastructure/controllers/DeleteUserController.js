"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteUserController = void 0;
class DeleteUserController {
    constructor(deleteUserUseCase) {
        this.deleteUserUseCase = deleteUserUseCase;
    }
    async execute(req, res) {
        try {
            const id = parseInt(req.params["id"]);
            if (isNaN(id)) {
                res.status(400).json({ error: 'ID invalido' });
                return;
            }
            await this.deleteUserUseCase.execute(id);
            res.status(200).json({ message: 'Usuario eliminado exitosamente' });
        }
        catch (error) {
            if (error instanceof Error) {
                res.status(400).json({ error: error.message });
            }
            else {
                res.status(500).json({ error: 'Error interno del servidor' });
            }
        }
    }
}
exports.DeleteUserController = DeleteUserController;
