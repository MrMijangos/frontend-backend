"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.configureLobbyRoutes = configureLobbyRoutes;
const express_1 = require("express");
const jwt_middleware_1 = require("../../../core/security/jwt_middleware");
function configureLobbyRoutes(createCtrl, getAllCtrl, getByIdCtrl, getByOwnerCtrl, updateCtrl, deleteCtrl, joinCtrl, leaveCtrl, getMembersCtrl) {
    const router = (0, express_1.Router)();
    router.post('/', jwt_middleware_1.jwtMiddleware, (req, res) => createCtrl.execute(req, res));
    router.get('/', jwt_middleware_1.jwtMiddleware, (req, res) => getAllCtrl.execute(req, res));
    router.get('/my', jwt_middleware_1.jwtMiddleware, (req, res) => getByOwnerCtrl.execute(req, res));
    router.get('/:id', jwt_middleware_1.jwtMiddleware, (req, res) => getByIdCtrl.execute(req, res));
    router.put('/:id', jwt_middleware_1.jwtMiddleware, (req, res) => updateCtrl.execute(req, res));
    router.delete('/:id', jwt_middleware_1.jwtMiddleware, (req, res) => deleteCtrl.execute(req, res));
    router.post('/:id/join', jwt_middleware_1.jwtMiddleware, (req, res) => joinCtrl.execute(req, res));
    router.post('/:id/leave', jwt_middleware_1.jwtMiddleware, (req, res) => leaveCtrl.execute(req, res));
    router.get('/:id/members', jwt_middleware_1.jwtMiddleware, (req, res) => getMembersCtrl.execute(req, res));
    return router;
}
