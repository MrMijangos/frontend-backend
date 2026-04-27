"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.jwtMiddleware = jwtMiddleware;
exports.requireRole = requireRole;
exports.requireAnyRole = requireAnyRole;
exports.optionalJWT = optionalJWT;
const auth_1 = require("./auth");
function jwtMiddleware(req, res, next) {
    const token = req.cookies?.access_token;
    if (!token) {
        res.status(401).json({ error: 'No autenticado - token no encontrado' });
        return;
    }
    const claims = (0, auth_1.validateJWT)(token);
    if (!claims) {
        res.status(401).json({ error: 'Token invalido o expirado' });
        return;
    }
    req.userId = claims.userId;
    req.email = claims.email;
    req.roleId = claims.roleId;
    next();
}
function requireRole(requiredRoleId) {
    return (req, res, next) => {
        if (!req.roleId) {
            res.status(403).json({ error: 'Rol no encontrado en el token' });
            return;
        }
        if (req.roleId !== requiredRoleId) {
            res.status(403).json({ error: 'No tienes permisos para acceder a este recurso' });
            return;
        }
        next();
    };
}
function requireAnyRole(...allowedRoleIds) {
    return (req, res, next) => {
        if (!req.roleId) {
            res.status(403).json({ error: 'Rol no encontrado en el token' });
            return;
        }
        if (!allowedRoleIds.includes(req.roleId)) {
            res.status(403).json({ error: 'No tienes permisos para acceder a este recurso' });
            return;
        }
        next();
    };
}
function optionalJWT(req, res, next) {
    const token = req.cookies?.access_token;
    if (!token) {
        next();
        return;
    }
    const claims = (0, auth_1.validateJWT)(token);
    if (claims) {
        req.userId = claims.userId;
        req.email = claims.email;
        req.roleId = claims.roleId;
    }
    next();
}
