"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.configurePostRoutes = configurePostRoutes;
const express_1 = require("express");
const jwt_middleware_1 = require("../../../core/security/jwt_middleware");
function configurePostRoutes(createCtrl, getAllCtrl, getByIdCtrl, getByUserCtrl, getByLobbyCtrl, updateCtrl, deleteCtrl, addImagesCtrl, getImagesCtrl, deleteImageCtrl) {
    const router = (0, express_1.Router)();
    router.post('/', jwt_middleware_1.jwtMiddleware, (req, res) => createCtrl.execute(req, res));
    router.get('/', jwt_middleware_1.jwtMiddleware, (req, res) => getAllCtrl.execute(req, res));
    router.get('/user/:id', jwt_middleware_1.jwtMiddleware, (req, res) => getByUserCtrl.execute(req, res));
    router.get('/lobby/:id', jwt_middleware_1.jwtMiddleware, (req, res) => getByLobbyCtrl.execute(req, res));
    router.get('/:id', jwt_middleware_1.jwtMiddleware, (req, res) => getByIdCtrl.execute(req, res));
    router.put('/:id', jwt_middleware_1.jwtMiddleware, (req, res) => updateCtrl.execute(req, res));
    router.delete('/:id', jwt_middleware_1.jwtMiddleware, (req, res) => deleteCtrl.execute(req, res));
    router.post('/:id/images', jwt_middleware_1.jwtMiddleware, (req, res) => addImagesCtrl.execute(req, res));
    router.get('/:id/images', jwt_middleware_1.jwtMiddleware, (req, res) => getImagesCtrl.execute(req, res));
    router.delete('/:id/images/:imageId', jwt_middleware_1.jwtMiddleware, (req, res) => deleteImageCtrl.execute(req, res));
    return router;
}
