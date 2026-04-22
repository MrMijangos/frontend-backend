import { Server } from 'socket.io';

// Mapa userId → socketId para enviar notificaciones a usuarios específicos
const userSockets = new Map<number, string>();

export function setupNotificationSocket(io: Server) {
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
export function sendNotificationToUser(
  io: Server,
  user_id: number,
  notification: object
) {
  const socketId = userSockets.get(user_id);
  if (socketId) {
    io.to(socketId).emit('new_notification', notification);
  }
}