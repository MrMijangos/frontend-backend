"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetLobbysByOwnerController = void 0;
class GetLobbysByOwnerController {
    constructor(getLobbysByOwnerUseCase) {
        this.getLobbysByOwnerUseCase = getLobbysByOwnerUseCase;
    }
    async execute(req, res) {
        try {
            const owner_id = req.userId;
            const lobbys = await this.getLobbysByOwnerUseCase.execute(owner_id);
            res.status(200).json({ lobbys: lobbys.map(l => ({ ...l, createdAt: l.createdAt.toISOString() })) });
        }
        catch {
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    }
}
exports.GetLobbysByOwnerController = GetLobbysByOwnerController;
