"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateUserUseCase = void 0;
const EmailValidator_1 = require("../domain/utils/EmailValidator");
class UpdateUserUseCase {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async execute(id, updateRequest) {
        const existingUser = await this.userRepository.getByID(id);
        if (!existingUser)
            throw new Error('Usuario no encontrado');
        if (!updateRequest.name?.trim())
            throw new Error('El nombre es obligatorio');
        if (!updateRequest.email?.trim())
            throw new Error('El email es obligatorio');
        if (!(0, EmailValidator_1.isValidEmail)(updateRequest.email))
            throw new Error('El email no es valido');
        const updatedUser = {
            ...existingUser,
            name: updateRequest.name.trim(),
            secondname: updateRequest.secondname?.trim() || null,
            lastname: updateRequest.lastname?.trim() || null,
            secondlastname: updateRequest.secondlastname?.trim() || null,
            email: updateRequest.email.trim().toLowerCase(),
            profile_picture: updateRequest.profile_picture !== undefined
                ? updateRequest.profile_picture
                : existingUser.profile_picture,
        };
        await this.userRepository.update(updatedUser);
        return updatedUser;
    }
}
exports.UpdateUserUseCase = UpdateUserUseCase;
