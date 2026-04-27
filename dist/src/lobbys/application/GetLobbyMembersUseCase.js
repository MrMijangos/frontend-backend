"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetLobbyMembersUseCase = void 0;
class GetLobbyMembersUseCase {
    constructor(lobbyRepository) {
        this.lobbyRepository = lobbyRepository;
    }
    async execute(lobby_id) {
        const lobby = await this.lobbyRepository.getByID(lobby_id);
        if (!lobby)
            throw new Error('Lobby no encontrado');
        return await this.lobbyRepository.getMembers(lobby_id);
    }
}
exports.GetLobbyMembersUseCase = GetLobbyMembersUseCase;
