"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.io = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const routes_1 = require("./src/users/infrastructure/routes/routes");
const lobbyRoutes_1 = require("./src/lobbys/infrastructure/routes/lobbyRoutes");
const messageRoutes_1 = require("./src/messages/infrastructure/routes/messageRoutes");
const postRoutes_1 = require("./src/posts/infrastructure/routes/postRoutes");
const notificationRoutes_1 = require("./src/notifications/infrastructure/routes/notificationRoutes");
const dependencies_1 = require("./src/users/infrastructure/dependencies");
const dependencies_2 = require("./src/lobbys/infrastructure/dependencies");
const dependencies_3 = require("./src/messages/infrastructure/dependencies");
const dependencies_4 = require("./src/posts/infrastructure/dependencies");
const dependencies_5 = require("./src/notifications/infrastructure/dependencies");
const chatSocket_1 = require("./src/messages/infrastructure/socket/chatSocket");
const notificationSocket_1 = require("./src/notifications/infrastructure/socket/notificationSocket");
dotenv_1.default.config();
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const FRONTEND_URL = process.env.FRONTEND_URL || "https://frontend-squad-up.vercel.app";
const io = new socket_io_1.Server(server, {
    cors: {
        origin: FRONTEND_URL,
        methods: ["GET", "POST"],
        credentials: true
    },
});
exports.io = io;
const PORT = process.env.PORT || 3000;
app.use((0, cors_1.default)({
    origin: FRONTEND_URL,
    credentials: true
}));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use('/uploads', express_1.default.static(path_1.default.join(process.cwd(), 'uploads')));
app.use('/api', (0, routes_1.configureUserRoutes)(dependencies_1.authController, dependencies_1.createUserController, dependencies_1.getAllUsersController, dependencies_1.getUserByIdController, dependencies_1.updateUserController, dependencies_1.deleteUserController));
app.use('/api/lobbys', (0, lobbyRoutes_1.configureLobbyRoutes)(dependencies_2.createLobbyController, dependencies_2.getAllLobbysController, dependencies_2.getLobbyByIdController, dependencies_2.getLobbysByOwnerController, dependencies_2.updateLobbyController, dependencies_2.deleteLobbyController, dependencies_2.joinLobbyController, dependencies_2.leaveLobbyController, dependencies_2.getLobbyMembersController));
app.use('/api/lobbys', (0, messageRoutes_1.configureMessageRoutes)(dependencies_3.getLobbyMessagesController));
app.use('/api/posts', (0, postRoutes_1.configurePostRoutes)(dependencies_4.createPostController, dependencies_4.getAllPostsController, dependencies_4.getPostByIdController, dependencies_4.getPostsByUserController, dependencies_4.getPostsByLobbyController, dependencies_4.updatePostController, dependencies_4.deletePostController, dependencies_4.addPostImagesController, dependencies_4.getPostImagesController, dependencies_4.deletePostImageController));
app.use('/api/notifications', (0, notificationRoutes_1.configureNotificationRoutes)(dependencies_5.getNotificationsController, dependencies_5.getUnreadNotificationsController, dependencies_5.markAsReadController, dependencies_5.markAllAsReadController, dependencies_5.deleteNotificationController));
(0, chatSocket_1.setupChatSocket)(io, dependencies_3.sendMessageUseCase, dependencies_3.getLobbyMessagesUseCase);
(0, notificationSocket_1.setupNotificationSocket)(io);
app.get('/', (_req, res) => res.json({ message: 'SquadUp API - Running' }));
server.listen(PORT, () => {
    console.log(`---------------------------------------------------`);
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    console.log(`🔌 WebSocket listo en ws://localhost:${PORT}`);
    console.log(`🛡️  CORS habilitado para: ${FRONTEND_URL}`);
    console.log(`---------------------------------------------------`);
});
