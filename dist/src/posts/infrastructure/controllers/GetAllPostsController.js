"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetAllPostsController = void 0;
class GetAllPostsController {
    constructor(getAllPostsUseCase) {
        this.getAllPostsUseCase = getAllPostsUseCase;
    }
    async execute(_req, res) {
        try {
            const posts = await this.getAllPostsUseCase.execute();
            res.status(200).json({ posts: posts.map(p => ({ ...p, createdAt: p.createdAt.toISOString() })) });
        }
        catch {
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    }
}
exports.GetAllPostsController = GetAllPostsController;
