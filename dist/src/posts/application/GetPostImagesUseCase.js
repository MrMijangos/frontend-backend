"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetPostImagesUseCase = void 0;
class GetPostImagesUseCase {
    constructor(postImageRepository) {
        this.postImageRepository = postImageRepository;
    }
    async execute(post_id) {
        return await this.postImageRepository.getByPost(post_id);
    }
}
exports.GetPostImagesUseCase = GetPostImagesUseCase;
