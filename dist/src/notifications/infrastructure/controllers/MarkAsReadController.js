"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MarkAsReadController = void 0;
class MarkAsReadController {
    constructor(markAsReadUseCase) {
        this.markAsReadUseCase = markAsReadUseCase;
    }
    async execute(req, res) {
        try {
            const id = parseInt(req.params['id']);
            if (isNaN(id)) {
                res.status(400).json({ error: 'ID invalido' });
                return;
            }
            await this.markAsReadUseCase.execute(id, req.userId);
            res.status(200).json({ message: 'Notificación marcada como leída' });
        }
        catch (error) {
            res.status(400).json({ error: error instanceof Error ? error.message : 'Error interno' });
        }
    }
}
exports.MarkAsReadController = MarkAsReadController;
