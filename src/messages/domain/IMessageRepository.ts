import { Message } from './entities/Message';

export interface IMessageRepository {
  save(message: Omit<Message, 'id' | 'sentAt'>): Promise<Message>;
  getByLobby(lobby_id: number, limit?: number): Promise<Message[]>;
  delete(id: number): Promise<void>;
}