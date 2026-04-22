import { Router } from 'express';
import { CreatePostController } from '../controllers/CreatePostController';
import { GetAllPostsController } from '../controllers/GetAllPostsController';
import { GetPostByIdController } from '../controllers/GetPostByIdController';
import { GetPostsByUserController } from '../controllers/GetPostsByUserController';
import { GetPostsByLobbyController } from '../controllers/GetPostsByLobbyController';
import { UpdatePostController } from '../controllers/UpdatePostController';
import { DeletePostController } from '../controllers/DeletePostController';
import { jwtMiddleware } from '../../../core/security/jwt_middleware';

export function configurePostRoutes(
  createCtrl: CreatePostController,
  getAllCtrl: GetAllPostsController,
  getByIdCtrl: GetPostByIdController,
  getByUserCtrl: GetPostsByUserController,
  getByLobbyCtrl: GetPostsByLobbyController,
  updateCtrl: UpdatePostController,
  deleteCtrl: DeletePostController,
): Router {
  const router = Router();

  router.post('/',                  jwtMiddleware, (req, res) => createCtrl.execute(req, res));
  router.get('/',                   jwtMiddleware, (req, res) => getAllCtrl.execute(req, res));
  router.get('/:id',                jwtMiddleware, (req, res) => getByIdCtrl.execute(req, res));
  router.get('/user/:id',           jwtMiddleware, (req, res) => getByUserCtrl.execute(req, res));
  router.get('/lobby/:id',          jwtMiddleware, (req, res) => getByLobbyCtrl.execute(req, res));
  router.put('/:id',                jwtMiddleware, (req, res) => updateCtrl.execute(req, res));
  router.delete('/:id',             jwtMiddleware, (req, res) => deleteCtrl.execute(req, res));

  return router;
}