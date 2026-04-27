"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetAllUsersUseCase = void 0;
class GetAllUsersUseCase {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async execute() {
        return await this.userRepository.getAll();
    }
}
exports.GetAllUsersUseCase = GetAllUsersUseCase;
