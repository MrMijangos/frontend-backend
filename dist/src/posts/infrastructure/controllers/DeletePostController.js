"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeletePostController = void 0;
class DeletePostController {
    constructor(deletePostUseCase) {
        this.deletePostUseCase = deletePostUseCase;
    }
    async execute(req, res) {
        try {
            const id = parseInt(req.params['id']);
            if (isNaN(id)) {
                res.status(400).json({ error: 'ID invalido' });
                return;
            }
            await this.deletePostUseCase.execute(id, req.userId);
            res.status(200).json({ message: 'Post eliminado' });
        }
        catch (error) {
            res.status(400).json({ error: error instanceof Error ? error.message : 'Error interno' });
        }
    }
}
exports.DeletePostController = DeletePostController;
