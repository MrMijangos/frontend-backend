"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetLobbyByIdController = void 0;
class GetLobbyByIdController {
    constructor(getLobbyByIdUseCase) {
        this.getLobbyByIdUseCase = getLobbyByIdUseCase;
    }
    async execute(req, res) {
        try {
            const id = parseInt(req.params["id"]);
            if (isNaN(id)) {
                res.status(400).json({ error: 'ID invalido' });
                return;
            }
            const lobby = await this.getLobbyByIdUseCase.execute(id);
            res.status(200).json({ lobby: { ...lobby, createdAt: lobby.createdAt.toISOString() } });
        }
        catch (error) {
            res.status(404).json({ error: error instanceof Error ? error.message : 'Error interno' });
        }
    }
}
exports.GetLobbyByIdController = GetLobbyByIdController;
