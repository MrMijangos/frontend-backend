"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const hash_1 = require("../../core/security/hash");
const EmailValidator_1 = require("../domain/utils/EmailValidator");
class AuthService {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async login(loginRequest) {
        const email = loginRequest.email.trim();
        if (!(0, EmailValidator_1.isValidEmail)(email))
            throw new Error('Email invalido');
        const user = await this.userRepository.getByEmail(email);
        if (!user)
            throw new Error('Credenciales invalidas');
        if (!user.password)
            throw new Error('Usuario registrado con OAuth - usa login social');
        const isPasswordValid = await (0, hash_1.checkPassword)(user.password, loginRequest.password);
        if (!isPasswordValid)
            throw new Error('Credenciales invalidas');
        return user;
    }
    async register(userRequest) {
        const email = userRequest.email.trim();
        if (!(0, EmailValidator_1.isValidEmail)(email))
            throw new Error('Email invalido');
        const existingUser = await this.userRepository.getByEmail(email);
        if (existingUser)
            throw new Error('El email ya esta registrado');
        if (!userRequest.password || userRequest.password.length < 6)
            throw new Error('La contraseña debe tener al menos 6 caracteres');
        const hashedPassword = await (0, hash_1.hashPassword)(userRequest.password);
        const newUser = {
            name: userRequest.name,
            secondname: userRequest.secondname || null,
            lastname: userRequest.lastname ?? null,
            secondlastname: userRequest.secondlastname || null,
            email,
            password: hashedPassword,
            profile_picture: userRequest.profile_picture || null,
        };
        return await this.userRepository.save(newUser);
    }
    async getUserByID(userId) {
        const user = await this.userRepository.getByID(userId);
        if (!user)
            throw new Error('Usuario no encontrado');
        return user;
    }
}
exports.AuthService = AuthService;
