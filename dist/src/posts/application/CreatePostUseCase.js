"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreatePostUseCase = void 0;
class CreatePostUseCase {
    constructor(postRepository) {
        this.postRepository = postRepository;
    }
    async execute(user_id, request) {
        if (!request.description?.trim() && !request.lobby_id) {
            throw new Error('El post debe tener descripción o pertenecer a un lobby');
        }
        const newPost = {
            user_id,
            lobby_id: request.lobby_id ?? null,
            description: request.description?.trim() || null,
        };
        return await this.postRepository.save(newPost);
    }
}
exports.CreatePostUseCase = CreatePostUseCase;
