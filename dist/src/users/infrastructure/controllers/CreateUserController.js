"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateUserController = void 0;
const uploadUser_1 = require("../../../core/upload/uploadUser");
class CreateUserController {
    constructor(createUserUseCase) {
        this.createUserUseCase = createUserUseCase;
    }
    async execute(req, res) {
        (0, uploadUser_1.uploadUserImage)(req, res, async (err) => {
            if (err) {
                res.status(400).json({ error: err.message });
                return;
            }
            try {
                const userRequest = req.body;
                if (!userRequest.name || !userRequest.email || !userRequest.password) {
                    res.status(400).json({ error: 'Campos obligatorios: name, email, password' });
                    return;
                }
                if (req.file) {
                    userRequest.profile_picture = `uploads/users/${req.file.filename}`;
                }
                const user = await this.createUserUseCase.execute(userRequest);
                res.status(201).json({
                    message: 'Usuario creado exitosamente',
                    user: {
                        id: user.id, name: user.name, secondname: user.secondname,
                        lastname: user.lastname, secondlastname: user.secondlastname,
                        email: user.email, profile_picture: user.profile_picture,
                        createdAt: user.createdAt.toISOString(),
                    },
                });
            }
            catch (error) {
                res.status(400).json({ error: error instanceof Error ? error.message : 'Error interno' });
            }
        });
    }
}
exports.CreateUserController = CreateUserController;
