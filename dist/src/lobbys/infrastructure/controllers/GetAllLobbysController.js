"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetAllLobbysController = void 0;
class GetAllLobbysController {
    constructor(getAllLobbysUseCase) {
        this.getAllLobbysUseCase = getAllLobbysUseCase;
    }
    async execute(_req, res) {
        try {
            const lobbys = await this.getAllLobbysUseCase.execute();
            res.status(200).json({ lobbys: lobbys.map(l => ({ ...l, createdAt: l.createdAt.toISOString() })) });
        }
        catch {
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    }
}
exports.GetAllLobbysController = GetAllLobbysController;
