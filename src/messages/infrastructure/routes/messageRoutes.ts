import { Router } from 'express';
import { GetLobbyMessagesController } from '../controllers/GetLobbyMessagesController';
import { jwtMiddleware } from '../../../core/security/jwt_middleware';

export function configureMessageRoutes(
  getLobbyMessagesCtrl: GetLobbyMessagesController,
): Router {
  const router = Router();

  // Historial de mensajes de un lobby (REST fallback)
  router.get('/:id/messages', jwtMiddleware, (req, res) => getLobbyMessagesCtrl.execute(req, res));

  return router;
}