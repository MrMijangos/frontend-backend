"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateUserUseCase = void 0;
const hash_1 = require("../../core/security/hash");
const EmailValidator_1 = require("../domain/utils/EmailValidator");
class CreateUserUseCase {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async execute(userRequest) {
        if (!userRequest.name?.trim())
            throw new Error('El nombre es obligatorio');
        if (!userRequest.email?.trim())
            throw new Error('El email es obligatorio');
        if (!(0, EmailValidator_1.isValidEmail)(userRequest.email))
            throw new Error('El email no es valido');
        if (!userRequest.password || userRequest.password.length < 6)
            throw new Error('La contraseña debe tener al menos 6 caracteres');
        const existingUser = await this.userRepository.getByEmail(userRequest.email);
        if (existingUser)
            throw new Error('El email ya esta registrado');
        const hashedPassword = await (0, hash_1.hashPassword)(userRequest.password);
        const newUser = {
            name: userRequest.name.trim(),
            secondname: userRequest.secondname?.trim() || null,
            lastname: userRequest.lastname?.trim() || null,
            secondlastname: userRequest.secondlastname?.trim() || null,
            email: userRequest.email.trim().toLowerCase(),
            password: hashedPassword,
            profile_picture: userRequest.profile_picture || null,
        };
        return await this.userRepository.save(newUser);
    }
}
exports.CreateUserUseCase = CreateUserUseCase;
