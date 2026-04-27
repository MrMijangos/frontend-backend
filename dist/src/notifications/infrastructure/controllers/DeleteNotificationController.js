"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteNotificationController = void 0;
class DeleteNotificationController {
    constructor(deleteNotificationUseCase) {
        this.deleteNotificationUseCase = deleteNotificationUseCase;
    }
    async execute(req, res) {
        try {
            const id = parseInt(req.params['id']);
            if (isNaN(id)) {
                res.status(400).json({ error: 'ID invalido' });
                return;
            }
            await this.deleteNotificationUseCase.execute(id, req.userId);
            res.status(200).json({ message: 'Notificación eliminada' });
        }
        catch (error) {
            res.status(400).json({ error: error instanceof Error ? error.message : 'Error interno' });
        }
    }
}
exports.DeleteNotificationController = DeleteNotificationController;
