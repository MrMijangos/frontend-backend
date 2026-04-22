import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import path from 'path';
import http from 'http';
import { Server } from 'socket.io';

import { configureUserRoutes } from './src/users/infrastructure/routes/routes';
import { configureLobbyRoutes } from './src/lobbys/infrastructure/routes/lobbyRoutes';
import { configureMessageRoutes } from './src/messages/infrastructure/routes/messageRoutes';
import { configurePostRoutes } from './src/posts/infrastructure/routes/postRoutes';
import { configureNotificationRoutes } from './src/notifications/infrastructure/routes/notificationRoutes';

import { authController, createUserController, getAllUsersController,
  getUserByIdController, updateUserController, deleteUserController,
} from './src/users/infrastructure/dependencies';

import { createLobbyController, getAllLobbysController, getLobbyByIdController,
  getLobbysByOwnerController, updateLobbyController, deleteLobbyController,
  joinLobbyController, leaveLobbyController, getLobbyMembersController,
} from './src/lobbys/infrastructure/dependencies';

import { sendMessageUseCase, getLobbyMessagesUseCase,
  getLobbyMessagesController,
} from './src/messages/infrastructure/dependencies';

import { createPostController, getAllPostsController, getPostByIdController,
  getPostsByUserController, getPostsByLobbyController, updatePostController,
  deletePostController, addPostImagesController, getPostImagesController,
  deletePostImageController,
} from './src/posts/infrastructure/dependencies';

import { getNotificationsController, getUnreadNotificationsController,
  markAsReadController, markAllAsReadController, deleteNotificationController,
} from './src/notifications/infrastructure/dependencies';

import { setupChatSocket } from './src/messages/infrastructure/socket/chatSocket';
import { setupNotificationSocket } from './src/notifications/infrastructure/socket/notificationSocket';

dotenv.config();

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:4200",
    methods: ["GET", "POST"],
    credentials: true
  },
});

export { io };

const PORT = process.env.PORT || 3000;

app.use(cors({ 
  origin: "http://localhost:4200", 
  credentials: true 
}));
app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

app.use('/api', configureUserRoutes(
  authController, createUserController, getAllUsersController,
  getUserByIdController, updateUserController, deleteUserController,
));

app.use('/api/lobbys', configureLobbyRoutes(
  createLobbyController, getAllLobbysController, getLobbyByIdController,
  getLobbysByOwnerController, updateLobbyController, deleteLobbyController,
  joinLobbyController, leaveLobbyController, getLobbyMembersController,
));

app.use('/api/lobbys', configureMessageRoutes(getLobbyMessagesController));

app.use('/api/posts', configurePostRoutes(
  createPostController, getAllPostsController, getPostByIdController,
  getPostsByUserController, getPostsByLobbyController, updatePostController,
  deletePostController, addPostImagesController, getPostImagesController,
  deletePostImageController,
));

app.use('/api/notifications', configureNotificationRoutes(
  getNotificationsController, getUnreadNotificationsController,
  markAsReadController, markAllAsReadController, deleteNotificationController,
));

setupChatSocket(io, sendMessageUseCase, getLobbyMessagesUseCase);
setupNotificationSocket(io);

app.get('/', (_req, res) => res.json({ message: 'SquadUp API - Running' }));

server.listen(PORT, () => {
  console.log(`---------------------------------------------------`);
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  console.log(`🔌 WebSocket listo en ws://localhost:${PORT}`);
  console.log(`🛡️  CORS habilitado para: http://localhost:4200`);
  console.log(`---------------------------------------------------`);
});