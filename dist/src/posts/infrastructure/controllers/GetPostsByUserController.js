"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetPostsByUserController = void 0;
class GetPostsByUserController {
    constructor(getPostsByUserUseCase) {
        this.getPostsByUserUseCase = getPostsByUserUseCase;
    }
    async execute(req, res) {
        try {
            const user_id = parseInt(req.params['id']);
            if (isNaN(user_id)) {
                res.status(400).json({ error: 'ID invalido' });
                return;
            }
            const posts = await this.getPostsByUserUseCase.execute(user_id);
            res.status(200).json({ posts: posts.map(p => ({ ...p, createdAt: p.createdAt.toISOString() })) });
        }
        catch {
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    }
}
exports.GetPostsByUserController = GetPostsByUserController;
