"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreatePostController = void 0;
const dependencies_1 = require("../../../notifications/infrastructure/dependencies");
const notificationSocket_1 = require("../../../notifications/infrastructure/socket/notificationSocket");
const main_1 = require("../../../../main");
const conn_1 = __importDefault(require("../../../core/config/conn"));
class CreatePostController {
    constructor(createPostUseCase) {
        this.createPostUseCase = createPostUseCase;
    }
    async execute(req, res) {
        try {
            const user_id = req.userId;
            const { description, lobby_id } = req.body;
            const post = await this.createPostUseCase.execute(user_id, {
                description,
                lobby_id: lobby_id ? parseInt(lobby_id) : undefined,
            });
            if (post.lobby_id) {
                const [members] = await conn_1.default.execute('SELECT user_id FROM lobby_members WHERE lobby_id = ? AND user_id != ?', [post.lobby_id, user_id]);
                for (const member of members) {
                    const notification = await dependencies_1.createNotificationUseCase.execute(member.user_id, 'new_post', { post_id: post.id, lobby_id: post.lobby_id, author_id: user_id });
                    (0, notificationSocket_1.sendNotificationToUser)(main_1.io, member.user_id, {
                        ...notification,
                        createdAt: notification.createdAt.toISOString(),
                    });
                }
            }
            res.status(201).json({
                message: 'Post creado exitosamente',
                post: { ...post, createdAt: post.createdAt.toISOString() },
            });
        }
        catch (error) {
            res.status(400).json({ error: error instanceof Error ? error.message : 'Error interno' });
        }
    }
}
exports.CreatePostController = CreatePostController;
