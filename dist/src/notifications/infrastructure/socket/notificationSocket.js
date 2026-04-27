"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupNotificationSocket = setupNotificationSocket;
exports.sendNotificationToUser = sendNotificationToUser;
// Mapa userId → socketId para enviar notificaciones a usuarios específicos
const userSockets = new Map();
function setupNotificationSocket(io) {
    io.on('connection', (socket) => {
        const userId = socket.data.userId;
        if (userId) {
            userSockets.set(userId, socket.id);
        }
        socket.on('disconnect', () => {
            userSockets.delete(userId);
        });
    });
}
// Llamar esto desde cualquier use case para emitir en tiempo real
function sendNotificationToUser(io, user_id, notification) {
    const socketId = userSockets.get(user_id);
    if (socketId) {
        io.to(socketId).emit('new_notification', notification);
    }
}
