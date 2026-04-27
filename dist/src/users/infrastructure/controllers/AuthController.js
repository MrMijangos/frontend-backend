"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const auth_1 = require("../../../core/security/auth");
class AuthController {
    constructor(authService) {
        this.authService = authService;
    }
    async login(req, res) {
        try {
            const loginRequest = req.body;
            const user = await this.authService.login(loginRequest);
            const accessToken = (0, auth_1.generateJWT)(user.id, user.email, 1);
            const refreshToken = (0, auth_1.generateRefreshToken)(user.id);
            (0, auth_1.setAuthCookie)(res, accessToken);
            (0, auth_1.setRefreshCookie)(res, refreshToken);
            const response = {
                message: 'Login exitoso',
                user: this.toResponse(user),
            };
            res.status(200).json(response);
        }
        catch (error) {
            res.status(401).json({ error: error instanceof Error ? error.message : 'Error interno' });
        }
    }
    async logout(_req, res) {
        (0, auth_1.clearAuthCookies)(res);
        res.status(200).json({ message: 'Logout exitoso' });
    }
    async refreshToken(req, res) {
        try {
            const refreshToken = req.cookies?.refresh_token;
            if (!refreshToken) {
                res.status(401).json({ error: 'Refresh token no encontrado' });
                return;
            }
            const claims = (0, auth_1.validateRefreshToken)(refreshToken);
            if (!claims) {
                res.status(401).json({ error: 'Refresh token invalido' });
                return;
            }
            const user = await this.authService.getUserByID(claims.userId);
            (0, auth_1.setAuthCookie)(res, (0, auth_1.generateJWT)(user.id, user.email, 1));
            res.status(200).json({ message: 'Token renovado' });
        }
        catch {
            res.status(401).json({ error: 'Error al renovar token' });
        }
    }
    async getProfile(req, res) {
        try {
            if (!req.userId) {
                res.status(401).json({ error: 'No autenticado' });
                return;
            }
            const user = await this.authService.getUserByID(req.userId);
            res.status(200).json({ user: this.toResponse(user) });
        }
        catch {
            res.status(404).json({ error: 'Usuario no encontrado' });
        }
    }
    async verifyToken(req, res) {
        res.status(200).json({ authenticated: true, user: { id: req.userId, email: req.email, roleId: req.roleId } });
    }
    toResponse(user) {
        return {
            id: user.id,
            name: user.name,
            secondname: user.secondname,
            lastname: user.lastname,
            secondlastname: user.secondlastname,
            email: user.email,
            profile_picture: user.profile_picture,
            createdAt: user.createdAt.toISOString(),
        };
    }
}
exports.AuthController = AuthController;
