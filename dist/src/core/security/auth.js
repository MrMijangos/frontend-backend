"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateJWT = generateJWT;
exports.generateRefreshToken = generateRefreshToken;
exports.validateJWT = validateJWT;
exports.validateRefreshToken = validateRefreshToken;
exports.setAuthCookie = setAuthCookie;
exports.setRefreshCookie = setRefreshCookie;
exports.clearAuthCookies = clearAuthCookies;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = process.env.JWT_SECRET || 'AmethToledo';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'AmethToledoRefresh';
function generateJWT(userId, email, roleId) {
    const payload = {
        userId,
        email,
        roleId,
    };
    return jsonwebtoken_1.default.sign(payload, JWT_SECRET, { expiresIn: '15m' });
}
function generateRefreshToken(userId) {
    const payload = {
        userId,
    };
    return jsonwebtoken_1.default.sign(payload, JWT_REFRESH_SECRET, { expiresIn: '7d' });
}
function validateJWT(token) {
    try {
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        return decoded;
    }
    catch (error) {
        return null;
    }
}
function validateRefreshToken(token) {
    try {
        const decoded = jsonwebtoken_1.default.verify(token, JWT_REFRESH_SECRET);
        return decoded;
    }
    catch (error) {
        return null;
    }
}
const isProd = process.env.NODE_ENV === 'production';
function setAuthCookie(res, token) {
    res.cookie('access_token', token, {
        httpOnly: true,
        secure: isProd,
        sameSite: isProd ? 'none' : 'lax',
        maxAge: 15 * 60 * 1000,
        path: '/',
    });
}
function setRefreshCookie(res, token) {
    res.cookie('refresh_token', token, {
        httpOnly: true,
        secure: isProd,
        sameSite: isProd ? 'none' : 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000,
        path: '/',
    });
}
function clearAuthCookies(res) {
    const cookieOptions = {
        httpOnly: true,
        secure: isProd,
        sameSite: isProd ? 'none' : 'lax',
        path: '/',
    };
    res.clearCookie('access_token', cookieOptions);
    res.clearCookie('refresh_token', cookieOptions);
}
