"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddPostImagesUseCase = void 0;
class AddPostImagesUseCase {
    constructor(postRepository, postImageRepository) {
        this.postRepository = postRepository;
        this.postImageRepository = postImageRepository;
    }
    async execute(post_id, user_id, image_urls) {
        const post = await this.postRepository.getByID(post_id);
        if (!post)
            throw new Error('Post no encontrado');
        if (post.user_id !== user_id)
            throw new Error('No tienes permiso para editar este post');
        if (image_urls.length === 0)
            throw new Error('Debes enviar al menos una imagen');
        return await this.postImageRepository.saveMany(post_id, image_urls);
    }
}
exports.AddPostImagesUseCase = AddPostImagesUseCase;
