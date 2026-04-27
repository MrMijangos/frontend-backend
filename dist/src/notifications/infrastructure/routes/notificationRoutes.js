"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.configureNotificationRoutes = configureNotificationRoutes;
const express_1 = require("express");
const jwt_middleware_1 = require("../../../core/security/jwt_middleware");
function configureNotificationRoutes(getCtrl, getUnreadCtrl, markAsReadCtrl, markAllAsReadCtrl, deleteCtrl) {
    const router = (0, express_1.Router)();
    router.get('/', jwt_middleware_1.jwtMiddleware, (req, res) => getCtrl.execute(req, res));
    router.get('/unread', jwt_middleware_1.jwtMiddleware, (req, res) => getUnreadCtrl.execute(req, res));
    router.patch('/:id/read', jwt_middleware_1.jwtMiddleware, (req, res) => markAsReadCtrl.execute(req, res));
    router.patch('/read-all', jwt_middleware_1.jwtMiddleware, (req, res) => markAllAsReadCtrl.execute(req, res));
    router.delete('/:id', jwt_middleware_1.jwtMiddleware, (req, res) => deleteCtrl.execute(req, res));
    return router;
}
