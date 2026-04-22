import { MySQLPostRepository } from './adapters/MySQLPostAdapter';
import { CreatePostUseCase } from '../application/CreatePostUseCase';
import { GetAllPostsUseCase } from '../application/GetAllPostsUseCase';
import { GetPostByIdUseCase } from '../application/GetPostByIdUseCase';
import { GetPostsByUserUseCase } from '../application/GetPostsByUserUseCase';
import { GetPostsByLobbyUseCase } from '../application/GetPostsByLobbyUseCase';
import { UpdatePostUseCase } from '../application/UpdatePostUseCase';
import { DeletePostUseCase } from '../application/DeletePostUseCase';
import { CreatePostController } from './controllers/CreatePostController';
import { GetAllPostsController } from './controllers/GetAllPostsController';
import { GetPostByIdController } from './controllers/GetPostByIdController';
import { GetPostsByUserController } from './controllers/GetPostsByUserController';
import { GetPostsByLobbyController } from './controllers/GetPostsByLobbyController';
import { UpdatePostController } from './controllers/UpdatePostController';
import { DeletePostController } from './controllers/DeletePostController';

const postRepository = new MySQLPostRepository();

const createPostUseCase      = new CreatePostUseCase(postRepository);
const getAllPostsUseCase      = new GetAllPostsUseCase(postRepository);
const getPostByIdUseCase     = new GetPostByIdUseCase(postRepository);
const getPostsByUserUseCase  = new GetPostsByUserUseCase(postRepository);
const getPostsByLobbyUseCase = new GetPostsByLobbyUseCase(postRepository);
const updatePostUseCase      = new UpdatePostUseCase(postRepository);
const deletePostUseCase      = new DeletePostUseCase(postRepository);

export const createPostController      = new CreatePostController(createPostUseCase);
export const getAllPostsController     = new GetAllPostsController(getAllPostsUseCase);
export const getPostByIdController    = new GetPostByIdController(getPostByIdUseCase);
export const getPostsByUserController = new GetPostsByUserController(getPostsByUserUseCase);
export const getPostsByLobbyController = new GetPostsByLobbyController(getPostsByLobbyUseCase);
export const updatePostController     = new UpdatePostController(updatePostUseCase);
export const deletePostController     = new DeletePostController(deletePostUseCase);