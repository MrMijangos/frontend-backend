"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.configureUserRoutes = configureUserRoutes;
const express_1 = require("express");
const jwt_middleware_1 = require("../../../core/security/jwt_middleware");
function configureUserRoutes(authCtrl, createUserCtrl, getAllUsersCtrl, getUserByIdCtrl, updateUserCtrl, deleteUserCtrl) {
    const router = (0, express_1.Router)();
    // Auth routes
    router.post('/auth/login', (req, res) => authCtrl.login(req, res));
    router.post('/auth/register', (req, res) => createUserCtrl.execute(req, res));
    router.post('/auth/logout', (req, res) => authCtrl.logout(req, res));
    router.post('/auth/refresh', (req, res) => authCtrl.refreshToken(req, res));
    router.get('/auth/profile', jwt_middleware_1.jwtMiddleware, (req, res) => authCtrl.getProfile(req, res));
    router.get('/auth/verify', jwt_middleware_1.jwtMiddleware, (req, res) => authCtrl.verifyToken(req, res));
    // User routes (protected)
    router.get('/users', jwt_middleware_1.jwtMiddleware, (req, res) => getAllUsersCtrl.execute(req, res));
    router.get('/users/:id', jwt_middleware_1.jwtMiddleware, (req, res) => getUserByIdCtrl.execute(req, res));
    router.put('/users/:id', jwt_middleware_1.jwtMiddleware, (req, res) => updateUserCtrl.execute(req, res));
    router.delete('/users/:id', jwt_middleware_1.jwtMiddleware, (req, res) => deleteUserCtrl.execute(req, res));
    return router;
}
