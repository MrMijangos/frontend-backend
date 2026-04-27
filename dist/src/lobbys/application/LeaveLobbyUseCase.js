"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeaveLobbyUseCase = void 0;
class LeaveLobbyUseCase {
    constructor(lobbyRepository) {
        this.lobbyRepository = lobbyRepository;
    }
    async execute(lobby_id, user_id) {
        const lobby = await this.lobbyRepository.getByID(lobby_id);
        if (!lobby)
            throw new Error('Lobby no encontrado');
        const isMember = await this.lobbyRepository.isMember(lobby_id, user_id);
        if (!isMember)
            throw new Error('No eres miembro de este lobby');
        if (lobby.owner_id === user_id)
            throw new Error('El owner no puede salir del lobby, solo eliminarlo');
        await this.lobbyRepository.removeMember(lobby_id, user_id);
    }
}
exports.LeaveLobbyUseCase = LeaveLobbyUseCase;
