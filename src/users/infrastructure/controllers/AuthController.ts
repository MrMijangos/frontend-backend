import { Request, Response } from 'express';
import { AuthService } from '../../application/AuthService';
import { LoginRequest } from '../../domain/dto/UserRequest';
import { UserResponse, LoginResponse } from '../../domain/dto/UserResponse';
import { generateJWT, generateRefreshToken, setAuthCookie, setRefreshCookie, clearAuthCookies, validateRefreshToken } from '../../../core/security/auth';

export class AuthController {
  constructor(private authService: AuthService) {}

  async login(req: Request, res: Response): Promise<void> {
    try {
      const loginRequest: LoginRequest = req.body;
      const user = await this.authService.login(loginRequest);

      const accessToken = generateJWT(user.id, user.email, 1);
      const refreshToken = generateRefreshToken(user.id);
      setAuthCookie(res, accessToken);
      setRefreshCookie(res, refreshToken);

      const response: LoginResponse = {
        message: 'Login exitoso',
        user: this.toResponse(user),
      };
      res.status(200).json(response);
    } catch (error) {
      res.status(401).json({ error: error instanceof Error ? error.message : 'Error interno' });
    }
  }

  async logout(_req: Request, res: Response): Promise<void> {
    clearAuthCookies(res);
    res.status(200).json({ message: 'Logout exitoso' });
  }

  async refreshToken(req: Request, res: Response): Promise<void> {
    try {
      const refreshToken = req.cookies?.refresh_token;
      if (!refreshToken) { res.status(401).json({ error: 'Refresh token no encontrado' }); return; }

      const claims = validateRefreshToken(refreshToken);
      if (!claims) { res.status(401).json({ error: 'Refresh token invalido' }); return; }

      const user = await this.authService.getUserByID(claims.userId);
      setAuthCookie(res, generateJWT(user.id, user.email, 1));
      res.status(200).json({ message: 'Token renovado' });
    } catch {
      res.status(401).json({ error: 'Error al renovar token' });
    }
  }

  async getProfile(req: Request, res: Response): Promise<void> {
    try {
      if (!req.userId) { res.status(401).json({ error: 'No autenticado' }); return; }
      const user = await this.authService.getUserByID(req.userId);
      res.status(200).json({ user: this.toResponse(user) });
    } catch {
      res.status(404).json({ error: 'Usuario no encontrado' });
    }
  }

  async verifyToken(req: Request, res: Response): Promise<void> {
    res.status(200).json({ authenticated: true, user: { id: req.userId, email: req.email, roleId: req.roleId } });
  }

  private toResponse(user: any): UserResponse {
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