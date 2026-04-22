import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import path from 'path';
import http from 'http';
import { Server } from 'socket.io';

import { configureUserRoutes } from './src/users/infrastructure/routes/routes';
import {
  authController, createUserController, getAllUsersController,
  getUserByIdController, updateUserController, deleteUserController,
} from './src/users/infrastructure/dependencies';

import { configureLobbyRoutes } from './src/lobbys/infrastructure/routes/lobbyRoutes';
import {
  createLobbyController, getAllLobbysController, getLobbyByIdController,
  getLobbysByOwnerController, updateLobbyController, deleteLobbyController,
  joinLobbyController, leaveLobbyController, getLobbyMembersController,
} from './src/lobbys/infrastructure/dependencies';

import { configureMessageRoutes } from './src/messages/infrastructure/routes/messageRoutes';
import {
  sendMessageUseCase, getLobbyMessagesUseCase, getLobbyMessagesController,
} from './src/messages/infrastructure/dependencies';

import { setupChatSocket } from './src/messages/infrastructure/socket/chatSocket';

import { configurePostRoutes } from './src/posts/infrastructure/routes/postRoutes';
import {
  createPostController, getAllPostsController, getPostByIdController,
  getPostsByUserController, getPostsByLobbyController,
  updatePostController, deletePostController,
} from './src/posts/infrastructure/dependencies';

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || '*',
    credentials: true,
  },
});

const PORT = process.env.PORT || 3000;

app.use(cors({ origin: process.env.FRONTEND_URL || '*', credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

app.use('/api', configureUserRoutes(
  authController, createUserController, getAllUsersController,
  getUserByIdController, updateUserController, deleteUserController
));

app.use('/api/lobbys', configureLobbyRoutes(
  createLobbyController, getAllLobbysController, getLobbyByIdController,
  getLobbysByOwnerController, updateLobbyController, deleteLobbyController,
  joinLobbyController, leaveLobbyController, getLobbyMembersController,
));

app.use('/api/lobbys', configureMessageRoutes(getLobbyMessagesController));

app.use('/api/posts', configurePostRoutes(
  createPostController, getAllPostsController, getPostByIdController,
  getPostsByUserController, getPostsByLobbyController,
  updatePostController, deletePostController,
));

setupChatSocket(io, sendMessageUseCase, getLobbyMessagesUseCase);

app.get('/', (_req, res) => res.json({ message: 'SquadUp API - Running' }));

server.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
  console.log(`WebSocket disponible en ws://localhost:${PORT}`);
});