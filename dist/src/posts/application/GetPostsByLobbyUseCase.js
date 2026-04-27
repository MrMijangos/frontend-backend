"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetPostsByLobbyUseCase = void 0;
class GetPostsByLobbyUseCase {
    constructor(postRepository) {
        this.postRepository = postRepository;
    }
    async execute(lobby_id) {
        return await this.postRepository.getByLobby(lobby_id);
    }
}
exports.GetPostsByLobbyUseCase = GetPostsByLobbyUseCase;
