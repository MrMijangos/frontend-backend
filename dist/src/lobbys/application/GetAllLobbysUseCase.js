"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetAllLobbysUseCase = void 0;
class GetAllLobbysUseCase {
    constructor(lobbyRepository) {
        this.lobbyRepository = lobbyRepository;
    }
    async execute() {
        return await this.lobbyRepository.getAll();
    }
}
exports.GetAllLobbysUseCase = GetAllLobbysUseCase;
