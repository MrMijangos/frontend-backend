import { Server, Socket } from 'socket.io';
import { SendMessageUseCase } from '../../application/SendMessageUseCase';
import { GetLobbyMessagesUseCase } from '../../application/GetLobbyMessagesUseCase';
import { validateJWT } from '../../../core/security/auth';

export function setupChatSocket(
  io: Server,
  sendMessageUseCase: SendMessageUseCase,
  getLobbyMessagesUseCase: GetLobbyMessagesUseCase,
) {
  // Middleware de autenticación por socket
  io.use((socket, next) => {
    const token = socket.handshake.auth?.token || socket.handshake.headers?.cookie
      ?.split(';')
      .find((c: string) => c.trim().startsWith('access_token='))
      ?.split('=')[1];

    if (!token) return next(new Error('No autenticado'));

    const claims = validateJWT(token);
    if (!claims) return next(new Error('Token inválido'));

    socket.data.userId = claims.userId;
    socket.data.email = claims.email;
    next();
  });

  io.on('connection', (socket: Socket) => {
    console.log(`Socket conectado: user ${socket.data.userId}`);

    // Unirse a la sala del lobby
    socket.on('join_lobby', async (lobby_id: number) => {
      socket.join(`lobby_${lobby_id}`);

      try {
        // Enviar historial de mensajes al conectarse
        const messages = await getLobbyMessagesUseCase.execute(lobby_id);
        socket.emit('message_history', messages.map(m => ({
          ...m, sentAt: m.sentAt.toISOString(),
        })));
      } catch (error) {
        console.error('Error al cargar historial de mensajes:', error);
        socket.emit('error', { message: 'Error al cargar mensajes' });
      }

      console.log(`User ${socket.data.userId} joined lobby_${lobby_id}`);
    });

    // Salir de la sala del lobby
    socket.on('leave_lobby', (lobby_id: number) => {
      socket.leave(`lobby_${lobby_id}`);
      console.log(`User ${socket.data.userId} left lobby_${lobby_id}`);
    });

    // Enviar mensaje
    socket.on('send_message', async (data: { lobby_id: number; content: string }) => {
      try {
        const message = await sendMessageUseCase.execute(
          data.lobby_id,
          socket.data.userId,
          data.content
        );

        // Emitir el mensaje a todos en la sala
        io.to(`lobby_${data.lobby_id}`).emit('new_message', {
          ...message,
          sentAt: message.sentAt.toISOString(),
        });
      } catch (error) {
        socket.emit('error', {
          message: error instanceof Error ? error.message : 'Error al enviar mensaje',
        });
      }
    });

    socket.on('disconnect', () => {
      console.log(`Socket desconectado: user ${socket.data.userId}`);
    });
  });
}