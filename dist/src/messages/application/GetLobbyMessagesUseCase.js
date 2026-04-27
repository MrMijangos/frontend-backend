"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetLobbyMessagesUseCase = void 0;
class GetLobbyMessagesUseCase {
    constructor(messageRepository) {
        this.messageRepository = messageRepository;
    }
    async execute(lobby_id, limit = 50) {
        return await this.messageRepository.getByLobby(lobby_id, limit);
    }
}
exports.GetLobbyMessagesUseCase = GetLobbyMessagesUseCase;
