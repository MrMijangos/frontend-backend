"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JoinLobbyController = void 0;
const dependencies_1 = require("../../../notifications/infrastructure/dependencies");
const notificationSocket_1 = require("../../../notifications/infrastructure/socket/notificationSocket");
const main_1 = require("../../../../main");
class JoinLobbyController {
    constructor(joinLobbyUseCase, getLobbyByIdUseCase) {
        this.joinLobbyUseCase = joinLobbyUseCase;
        this.getLobbyByIdUseCase = getLobbyByIdUseCase;
    }
    async execute(req, res) {
        try {
            const lobby_id = parseInt(req.params['id']);
            if (isNaN(lobby_id)) {
                res.status(400).json({ error: 'ID invalido' });
                return;
            }
            const member = await this.joinLobbyUseCase.execute(lobby_id, req.userId);
            const lobby = await this.getLobbyByIdUseCase.execute(lobby_id);
            const notification = await dependencies_1.createNotificationUseCase.execute(lobby.owner_id, 'lobby_join', { lobby_id: lobby.id, lobby_name: lobby.name, user_id: req.userId });
            (0, notificationSocket_1.sendNotificationToUser)(main_1.io, lobby.owner_id, {
                ...notification,
                createdAt: notification.createdAt.toISOString(),
            });
            res.status(201).json({
                message: 'Te uniste al lobby',
                member: { ...member, joinedAt: member.joinedAt.toISOString() },
            });
        }
        catch (error) {
            res.status(400).json({ error: error instanceof Error ? error.message : 'Error interno' });
        }
    }
}
exports.JoinLobbyController = JoinLobbyController;
