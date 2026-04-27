"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeletePostImageUseCase = void 0;
class DeletePostImageUseCase {
    constructor(postRepository, postImageRepository) {
        this.postRepository = postRepository;
        this.postImageRepository = postImageRepository;
    }
    async execute(post_id, image_id, user_id) {
        const post = await this.postRepository.getByID(post_id);
        if (!post)
            throw new Error('Post no encontrado');
        if (post.user_id !== user_id)
            throw new Error('No tienes permiso para eliminar imágenes de este post');
        await this.postImageRepository.delete(image_id);
    }
}
exports.DeletePostImageUseCase = DeletePostImageUseCase;
