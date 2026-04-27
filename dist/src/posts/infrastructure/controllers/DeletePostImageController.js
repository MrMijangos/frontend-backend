"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeletePostImageController = void 0;
class DeletePostImageController {
    constructor(deletePostImageUseCase) {
        this.deletePostImageUseCase = deletePostImageUseCase;
    }
    async execute(req, res) {
        try {
            const post_id = parseInt(req.params['id']);
            const image_id = parseInt(req.params['imageId']);
            if (isNaN(post_id) || isNaN(image_id)) {
                res.status(400).json({ error: 'ID invalido' });
                return;
            }
            await this.deletePostImageUseCase.execute(post_id, image_id, req.userId);
            res.status(200).json({ message: 'Imagen eliminada' });
        }
        catch (error) {
            res.status(400).json({ error: error instanceof Error ? error.message : 'Error interno' });
        }
    }
}
exports.DeletePostImageController = DeletePostImageController;
