"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetLobbyMembersController = void 0;
class GetLobbyMembersController {
    constructor(getLobbyMembersUseCase) {
        this.getLobbyMembersUseCase = getLobbyMembersUseCase;
    }
    async execute(req, res) {
        try {
            const lobby_id = parseInt(req.params["id"]);
            if (isNaN(lobby_id)) {
                res.status(400).json({ error: 'ID invalido' });
                return;
            }
            const members = await this.getLobbyMembersUseCase.execute(lobby_id);
            res.status(200).json({ members: members.map(m => ({ ...m, joinedAt: m.joinedAt.toISOString() })) });
        }
        catch (error) {
            res.status(404).json({ error: error instanceof Error ? error.message : 'Error interno' });
        }
    }
}
exports.GetLobbyMembersController = GetLobbyMembersController;
