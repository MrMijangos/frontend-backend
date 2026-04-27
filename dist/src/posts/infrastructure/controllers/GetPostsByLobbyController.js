"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetPostsByLobbyController = void 0;
class GetPostsByLobbyController {
    constructor(getPostsByLobbyUseCase) {
        this.getPostsByLobbyUseCase = getPostsByLobbyUseCase;
    }
    async execute(req, res) {
        try {
            const lobby_id = parseInt(req.params['id']);
            if (isNaN(lobby_id)) {
                res.status(400).json({ error: 'ID invalido' });
                return;
            }
            const posts = await this.getPostsByLobbyUseCase.execute(lobby_id);
            res.status(200).json({ posts: posts.map(p => ({ ...p, createdAt: p.createdAt.toISOString() })) });
        }
        catch {
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    }
}
exports.GetPostsByLobbyController = GetPostsByLobbyController;
