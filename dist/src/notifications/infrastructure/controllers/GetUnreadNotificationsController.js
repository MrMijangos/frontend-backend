"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetUnreadNotificationsController = void 0;
class GetUnreadNotificationsController {
    constructor(getUnreadNotificationsUseCase) {
        this.getUnreadNotificationsUseCase = getUnreadNotificationsUseCase;
    }
    async execute(req, res) {
        try {
            const notifications = await this.getUnreadNotificationsUseCase.execute(req.userId);
            res.status(200).json({
                notifications: notifications.map(n => ({ ...n, createdAt: n.createdAt.toISOString() })),
                count: notifications.length,
            });
        }
        catch {
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    }
}
exports.GetUnreadNotificationsController = GetUnreadNotificationsController;
