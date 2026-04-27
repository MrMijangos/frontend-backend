"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetPostByIdUseCase = void 0;
class GetPostByIdUseCase {
    constructor(postRepository) {
        this.postRepository = postRepository;
    }
    async execute(id) {
        const post = await this.postRepository.getByID(id);
        if (!post)
            throw new Error('Post no encontrado');
        return post;
    }
}
exports.GetPostByIdUseCase = GetPostByIdUseCase;
