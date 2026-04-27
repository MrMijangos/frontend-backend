"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetPostImagesController = void 0;
class GetPostImagesController {
    constructor(getPostImagesUseCase) {
        this.getPostImagesUseCase = getPostImagesUseCase;
    }
    async execute(req, res) {
        try {
            const post_id = parseInt(req.params['id']);
            if (isNaN(post_id)) {
                res.status(400).json({ error: 'ID invalido' });
                return;
            }
            const images = await this.getPostImagesUseCase.execute(post_id);
            res.status(200).json({ images });
        }
        catch {
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    }
}
exports.GetPostImagesController = GetPostImagesController;
