"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MarkAllAsReadController = void 0;
class MarkAllAsReadController {
    constructor(markAllAsReadUseCase) {
        this.markAllAsReadUseCase = markAllAsReadUseCase;
    }
    async execute(req, res) {
        try {
            await this.markAllAsReadUseCase.execute(req.userId);
            res.status(200).json({ message: 'Todas las notificaciones marcadas como leídas' });
        }
        catch {
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    }
}
exports.MarkAllAsReadController = MarkAllAsReadController;
