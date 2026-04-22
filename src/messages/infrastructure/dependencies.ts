import { MySQLMessageRepository } from './adapters/MySQLMessageAdapter';
import { SendMessageUseCase } from '../application/SendMessageUseCase';
import { GetLobbyMessagesUseCase } from '../application/GetLobbyMessagesUseCase';
import { GetLobbyMessagesController } from './controllers/GetLobbyMessagesController';

const messageRepository = new MySQLMessageRepository();

export const sendMessageUseCase       = new SendMessageUseCase(messageRepository);
export const getLobbyMessagesUseCase  = new GetLobbyMessagesUseCase(messageRepository);
export const getLobbyMessagesController = new GetLobbyMessagesController(getLobbyMessagesUseCase);