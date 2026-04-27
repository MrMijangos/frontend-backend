"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.configureMessageRoutes = configureMessageRoutes;
const express_1 = require("express");
const jwt_middleware_1 = require("../../../core/security/jwt_middleware");
function configureMessageRoutes(getLobbyMessagesCtrl) {
    const router = (0, express_1.Router)();
    // Historial de mensajes de un lobby (REST fallback)
    router.get('/:id/messages', jwt_middleware_1.jwtMiddleware, (req, res) => getLobbyMessagesCtrl.execute(req, res));
    return router;
}
