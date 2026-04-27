"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetAllPostsUseCase = void 0;
class GetAllPostsUseCase {
    constructor(postRepository) {
        this.postRepository = postRepository;
    }
    async execute() {
        return await this.postRepository.getAll();
    }
}
exports.GetAllPostsUseCase = GetAllPostsUseCase;
