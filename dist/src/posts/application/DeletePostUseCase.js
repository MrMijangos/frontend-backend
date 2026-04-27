"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeletePostUseCase = void 0;
class DeletePostUseCase {
    constructor(postRepository) {
        this.postRepository = postRepository;
    }
    async execute(id, user_id) {
        const existing = await this.postRepository.getByID(id);
        if (!existing)
            throw new Error('Post no encontrado');
        if (existing.user_id !== user_id)
            throw new Error('No tienes permiso para eliminar este post');
        await this.postRepository.delete(id);
    }
}
exports.DeletePostUseCase = DeletePostUseCase;
