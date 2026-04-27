"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdatePostController = void 0;
class UpdatePostController {
    constructor(updatePostUseCase) {
        this.updatePostUseCase = updatePostUseCase;
    }
    async execute(req, res) {
        try {
            const id = parseInt(req.params['id']);
            if (isNaN(id)) {
                res.status(400).json({ error: 'ID invalido' });
                return;
            }
            const post = await this.updatePostUseCase.execute(id, req.userId, req.body);
            res.status(200).json({ message: 'Post actualizado', post: { ...post, createdAt: post.createdAt.toISOString() } });
        }
        catch (error) {
            res.status(400).json({ error: error instanceof Error ? error.message : 'Error interno' });
        }
    }
}
exports.UpdatePostController = UpdatePostController;
