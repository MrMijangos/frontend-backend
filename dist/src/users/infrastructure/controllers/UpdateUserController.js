"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateUserController = void 0;
const uploadUser_1 = require("../../../core/upload/uploadUser");
class UpdateUserController {
    constructor(updateUserUseCase) {
        this.updateUserUseCase = updateUserUseCase;
    }
    async execute(req, res) {
        (0, uploadUser_1.uploadUserImage)(req, res, async (err) => {
            if (err) {
                res.status(400).json({ error: err.message });
                return;
            }
            try {
                const id = parseInt(req.params["id"]);
                if (isNaN(id)) {
                    res.status(400).json({ error: 'ID invalido' });
                    return;
                }
                const updateRequest = req.body;
                if (!updateRequest.name || !updateRequest.email) {
                    res.status(400).json({ error: 'Campos obligatorios: name, email' });
                    return;
                }
                if (req.file) {
                    updateRequest.profile_picture = `uploads/users/${req.file.filename}`;
                }
                const user = await this.updateUserUseCase.execute(id, updateRequest);
                res.status(200).json({
                    message: 'Usuario actualizado exitosamente',
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
exports.UpdateUserController = UpdateUserController;
