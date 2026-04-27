"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateLobbyUseCase = void 0;
class CreateLobbyUseCase {
    constructor(lobbyRepository) {
        this.lobbyRepository = lobbyRepository;
    }
    async execute(owner_id, request) {
        if (!request.name?.trim())
            throw new Error('El nombre del lobby es obligatorio');
        if (!request.game?.trim())
            throw new Error('El juego es obligatorio');
        const newLobby = {
            name: request.name.trim(),
            description: request.description?.trim() || null,
            game: request.game.trim(),
            max_members: request.max_members || 10,
            image: request.image || null,
            owner_id,
        };
        return await this.lobbyRepository.save(newLobby);
    }
}
exports.CreateLobbyUseCase = CreateLobbyUseCase;
