"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetLobbyByIdUseCase = void 0;
class GetLobbyByIdUseCase {
    constructor(lobbyRepository) {
        this.lobbyRepository = lobbyRepository;
    }
    async execute(id) {
        const lobby = await this.lobbyRepository.getByID(id);
        if (!lobby)
            throw new Error('Lobby no encontrado');
        return lobby;
    }
}
exports.GetLobbyByIdUseCase = GetLobbyByIdUseCase;
