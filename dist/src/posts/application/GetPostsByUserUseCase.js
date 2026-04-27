"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetPostsByUserUseCase = void 0;
class GetPostsByUserUseCase {
    constructor(postRepository) {
        this.postRepository = postRepository;
    }
    async execute(user_id) {
        return await this.postRepository.getByUser(user_id);
    }
}
exports.GetPostsByUserUseCase = GetPostsByUserUseCase;
