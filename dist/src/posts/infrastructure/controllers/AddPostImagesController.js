"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddPostImagesController = void 0;
const uploadPost_1 = require("../../../core/upload/uploadPost");
class AddPostImagesController {
    constructor(addPostImagesUseCase) {
        this.addPostImagesUseCase = addPostImagesUseCase;
    }
    async execute(req, res) {
        (0, uploadPost_1.uploadPostImages)(req, res, async (err) => {
            if (err) {
                res.status(400).json({ error: err.message });
                return;
            }
            try {
                const post_id = parseInt(req.params['id']);
                if (isNaN(post_id)) {
                    res.status(400).json({ error: 'ID invalido' });
                    return;
                }
                const files = req.files;
                if (!files || files.length === 0) {
                    res.status(400).json({ error: 'Debes enviar al menos una imagen' });
                    return;
                }
                const image_urls = files.map(f => `uploads/posts/${f.filename}`);
                const images = await this.addPostImagesUseCase.execute(post_id, req.userId, image_urls);
                res.status(201).json({ message: 'Imágenes agregadas', images });
            }
            catch (error) {
                res.status(400).json({ error: error instanceof Error ? error.message : 'Error interno' });
            }
        });
    }
}
exports.AddPostImagesController = AddPostImagesController;
