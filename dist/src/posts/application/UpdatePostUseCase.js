"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdatePostUseCase = void 0;
class UpdatePostUseCase {
    constructor(postRepository) {
        this.postRepository = postRepository;
    }
    async execute(id, user_id, request) {
        const existing = await this.postRepository.getByID(id);
        if (!existing)
            throw new Error('Post no encontrado');
        if (existing.user_id !== user_id)
            throw new Error('No tienes permiso para editar este post');
        const updated = {
            ...existing,
            description: request.description?.trim() ?? existing.description,
        };
        await this.postRepository.update(updated);
        return updated;
    }
}
exports.UpdatePostUseCase = UpdatePostUseCase;
