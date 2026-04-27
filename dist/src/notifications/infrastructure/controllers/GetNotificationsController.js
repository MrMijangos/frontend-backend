"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetNotificationsController = void 0;
class GetNotificationsController {
    constructor(getNotificationsUseCase) {
        this.getNotificationsUseCase = getNotificationsUseCase;
    }
    async execute(req, res) {
        try {
            const notifications = await this.getNotificationsUseCase.execute(req.userId);
            res.status(200).json({
                notifications: notifications.map(n => ({ ...n, createdAt: n.createdAt.toISOString() })),
            });
        }
        catch {
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    }
}
exports.GetNotificationsController = GetNotificationsController;
