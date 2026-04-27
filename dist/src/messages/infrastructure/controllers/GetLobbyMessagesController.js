"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetLobbyMessagesController = void 0;
class GetLobbyMessagesController {
    constructor(getLobbyMessagesUseCase) {
        this.getLobbyMessagesUseCase = getLobbyMessagesUseCase;
    }
    async execute(req, res) {
        try {
            const lobby_id = parseInt(req.params["id"]);
            if (isNaN(lobby_id)) {
                res.status(400).json({ error: 'ID invalido' });
                return;
            }
            const limit = req.query.limit ? parseInt(req.query.limit) : 50;
            const messages = await this.getLobbyMessagesUseCase.execute(lobby_id, limit);
            res.status(200).json({
                messages: messages.map(m => ({ ...m, sentAt: m.sentAt.toISOString() })),
            });
        }
        catch (error) {
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    }
}
exports.GetLobbyMessagesController = GetLobbyMessagesController;
