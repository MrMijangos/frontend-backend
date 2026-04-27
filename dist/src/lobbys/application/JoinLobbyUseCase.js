"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JoinLobbyUseCase = void 0;
class JoinLobbyUseCase {
    constructor(lobbyRepository) {
        this.lobbyRepository = lobbyRepository;
    }
    async execute(lobby_id, user_id) {
        const lobby = await this.lobbyRepository.getByID(lobby_id);
        if (!lobby)
            throw new Error('Lobby no encontrado');
        const already = await this.lobbyRepository.isMember(lobby_id, user_id);
        if (already)
            throw new Error('Ya eres miembro de este lobby');
        return await this.lobbyRepository.addMember(lobby_id, user_id);
    }
}
exports.JoinLobbyUseCase = JoinLobbyUseCase;
