"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeaveLobbyController = void 0;
const dependencies_1 = require("../../../notifications/infrastructure/dependencies");
const notificationSocket_1 = require("../../../notifications/infrastructure/socket/notificationSocket");
const main_1 = require("../../../../main");
class LeaveLobbyController {
    constructor(leaveLobbyUseCase, getLobbyByIdUseCase) {
        this.leaveLobbyUseCase = leaveLobbyUseCase;
        this.getLobbyByIdUseCase = getLobbyByIdUseCase;
    }
    async execute(req, res) {
        try {
            const lobby_id = parseInt(req.params['id']);
            if (isNaN(lobby_id)) {
                res.status(400).json({ error: 'ID invalido' });
                return;
            }
            const lobby = await this.getLobbyByIdUseCase.execute(lobby_id);
            await this.leaveLobbyUseCase.execute(lobby_id, req.userId);
            const notification = await dependencies_1.createNotificationUseCase.execute(lobby.owner_id, 'lobby_leave', { lobby_id: lobby.id, lobby_name: lobby.name, user_id: req.userId });
            (0, notificationSocket_1.sendNotificationToUser)(main_1.io, lobby.owner_id, {
                ...notification,
                createdAt: notification.createdAt.toISOString(),
            });
            res.status(200).json({ message: 'Saliste del lobby' });
        }
        catch (error) {
            res.status(400).json({ error: error instanceof Error ? error.message : 'Error interno' });
        }
    }
}
exports.LeaveLobbyController = LeaveLobbyController;
