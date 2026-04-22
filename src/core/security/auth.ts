import jwt from 'jsonwebtoken';
import { Response } from 'express';

const JWT_SECRET = process.env.JWT_SECRET || 'AmethToledo';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'AmethToledoRefresh';

interface JWTPayload {
  userId: number;
  email: string;
  roleId: number;
}

interface RefreshPayload {
  userId: number;
}

export function generateJWT(userId: number, email: string, roleId: number): string {
  const payload: JWTPayload = {
    userId,
    email,
    roleId,
  };

  return jwt.sign(payload, JWT_SECRET, { expiresIn: '15m' });
}

export function generateRefreshToken(userId: number): string {
  const payload: RefreshPayload = {
    userId,
  };

  return jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn: '7d' });
}

export function validateJWT(token: string): JWTPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
    return decoded;
  } catch (error) {
    return null;
  }
}

export function validateRefreshToken(token: string): RefreshPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_REFRESH_SECRET) as RefreshPayload;
    return decoded;
  } catch (error) {
    return null;
  }
}

export function setAuthCookie(res: Response, token: string): void {
  res.cookie('access_token', token, {
    httpOnly: true,
    secure: true,      
    sameSite: 'none',  
    maxAge: 15 * 60 * 1000, 
    path: '/',
  });
}

export function setRefreshCookie(res: Response, token: string): void {
  res.cookie('refresh_token', token, {
    httpOnly: true,
    secure: true,       
    sameSite: 'none',   
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: '/',          
  });
}

export function clearAuthCookies(res: Response): void {
  const cookieOptions = {
    httpOnly: true,
    secure: true,
    sameSite: 'none' as const,
    path: '/',
  };

  res.clearCookie('access_token', cookieOptions);
  res.clearCookie('refresh_token', cookieOptions);
}

function isProduction(): boolean {
  return process.env.NODE_ENV === 'production';
}