"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetLobbysByOwnerUseCase = void 0;
class GetLobbysByOwnerUseCase {
    constructor(lobbyRepository) {
        this.lobbyRepository = lobbyRepository;
    }
    async execute(owner_id) {
        return await this.lobbyRepository.getByOwner(owner_id);
    }
}
exports.GetLobbysByOwnerUseCase = GetLobbysByOwnerUseCase;
