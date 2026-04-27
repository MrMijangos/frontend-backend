"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteUserUseCase = void 0;
class DeleteUserUseCase {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async execute(id) {
        const existingUser = await this.userRepository.getByID(id);
        if (!existingUser) {
            throw new Error('Usuario no encontrado');
        }
        await this.userRepository.delete(id);
    }
}
exports.DeleteUserUseCase = DeleteUserUseCase;
