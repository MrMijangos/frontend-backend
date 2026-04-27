"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteLobbyUseCase = void 0;
class DeleteLobbyUseCase {
    constructor(lobbyRepository) {
        this.lobbyRepository = lobbyRepository;
    }
    async execute(id, owner_id) {
        const existing = await this.lobbyRepository.getByID(id);
        if (!existing)
            throw new Error('Lobby no encontrado');
        if (existing.owner_id !== owner_id)
            throw new Error('No tienes permiso para eliminar este lobby');
        await this.lobbyRepository.delete(id);
    }
}
exports.DeleteLobbyUseCase = DeleteLobbyUseCase;
