import { Router } from 'express';
import { CreateLobbyController } from '../controllers/CreateLobbyController';
import { GetAllLobbysController } from '../controllers/GetAllLobbysController';
import { GetLobbyByIdController } from '../controllers/GetLobbyByIdController';
import { GetLobbysByOwnerController } from '../controllers/GetLobbysByOwnerController';
import { UpdateLobbyController } from '../controllers/UpdateLobbyController';
import { DeleteLobbyController } from '../controllers/DeleteLobbyController';
import { JoinLobbyController } from '../controllers/JoinLobbyController';
import { LeaveLobbyController } from '../controllers/LeaveLobbyController';
import { GetLobbyMembersController } from '../controllers/GetLobbyMembersController';
import { jwtMiddleware } from '../../../core/security/jwt_middleware';

export function configureLobbyRoutes(
  createCtrl: CreateLobbyController,
  getAllCtrl: GetAllLobbysController,
  getByIdCtrl: GetLobbyByIdController,
  getByOwnerCtrl: GetLobbysByOwnerController,
  updateCtrl: UpdateLobbyController,
  deleteCtrl: DeleteLobbyController,
  joinCtrl: JoinLobbyController,
  leaveCtrl: LeaveLobbyController,
  getMembersCtrl: GetLobbyMembersController,
): Router {
  const router = Router();

  router.post('/',            jwtMiddleware, (req, res) => createCtrl.execute(req, res));
  router.get('/',             jwtMiddleware, (req, res) => getAllCtrl.execute(req, res));
  router.get('/my',           jwtMiddleware, (req, res) => getByOwnerCtrl.execute(req, res));
  router.get('/:id',          jwtMiddleware, (req, res) => getByIdCtrl.execute(req, res));
  router.put('/:id',          jwtMiddleware, (req, res) => updateCtrl.execute(req, res));
  router.delete('/:id',       jwtMiddleware, (req, res) => deleteCtrl.execute(req, res));
  router.post('/:id/join',    jwtMiddleware, (req, res) => joinCtrl.execute(req, res));
  router.post('/:id/leave',   jwtMiddleware, (req, res) => leaveCtrl.execute(req, res));
  router.get('/:id/members',  jwtMiddleware, (req, res) => getMembersCtrl.execute(req, res));

  return router;
}