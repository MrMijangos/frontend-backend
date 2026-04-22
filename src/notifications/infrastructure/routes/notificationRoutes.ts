import { Router } from 'express';
import { GetNotificationsController } from '../controllers/GetNotificationsController';
import { GetUnreadNotificationsController } from '../controllers/GetUnreadNotificationsController';
import { MarkAsReadController } from '../controllers/MarkAsReadController';
import { MarkAllAsReadController } from '../controllers/MarkAllAsReadController';
import { DeleteNotificationController } from '../controllers/DeleteNotificationController';
import { jwtMiddleware } from '../../../core/security/jwt_middleware';

export function configureNotificationRoutes(
  getCtrl: GetNotificationsController,
  getUnreadCtrl: GetUnreadNotificationsController,
  markAsReadCtrl: MarkAsReadController,
  markAllAsReadCtrl: MarkAllAsReadController,
  deleteCtrl: DeleteNotificationController,
): Router {
  const router = Router();

  router.get('/',              jwtMiddleware, (req, res) => getCtrl.execute(req, res));
  router.get('/unread',        jwtMiddleware, (req, res) => getUnreadCtrl.execute(req, res));
  router.patch('/:id/read',    jwtMiddleware, (req, res) => markAsReadCtrl.execute(req, res));
  router.patch('/read-all',    jwtMiddleware, (req, res) => markAllAsReadCtrl.execute(req, res));
  router.delete('/:id',        jwtMiddleware, (req, res) => deleteCtrl.execute(req, res));

  return router;
}