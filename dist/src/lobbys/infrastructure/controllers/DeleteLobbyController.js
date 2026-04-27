"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteLobbyController = void 0;
class DeleteLobbyController {
    constructor(deleteLobbyUseCase) {
        this.deleteLobbyUseCase = deleteLobbyUseCase;
    }
    async execute(req, res) {
        try {
            const id = parseInt(req.params["id"]);
            if (isNaN(id)) {
                res.status(400).json({ error: 'ID invalido' });
                return;
            }
            await this.deleteLobbyUseCase.execute(id, req.userId);
            res.status(200).json({ message: 'Lobby eliminado exitosamente' });
        }
        catch (error) {
            res.status(400).json({ error: error instanceof Error ? error.message : 'Error interno' });
        }
    }
}
exports.DeleteLobbyController = DeleteLobbyController;
