"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetUserByIdUseCase = void 0;
class GetUserByIdUseCase {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async execute(id) {
        const user = await this.userRepository.getByID(id);
        if (!user) {
            throw new Error('Usuario no encontrado');
        }
        return user;
    }
}
exports.GetUserByIdUseCase = GetUserByIdUseCase;
