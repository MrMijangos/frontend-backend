"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetPostByIdController = void 0;
class GetPostByIdController {
    constructor(getPostByIdUseCase) {
        this.getPostByIdUseCase = getPostByIdUseCase;
    }
    async execute(req, res) {
        try {
            const id = parseInt(req.params['id']);
            if (isNaN(id)) {
                res.status(400).json({ error: 'ID invalido' });
                return;
            }
            const post = await this.getPostByIdUseCase.execute(id);
            res.status(200).json({ post: { ...post, createdAt: post.createdAt.toISOString() } });
        }
        catch (error) {
            res.status(404).json({ error: error instanceof Error ? error.message : 'Error interno' });
        }
    }
}
exports.GetPostByIdController = GetPostByIdController;
