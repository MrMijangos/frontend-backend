import { IMessageRepository } from '../domain/IMessageRepository';
import { Message } from '../domain/entities/Message';

export class GetLobbyMessagesUseCase {
  constructor(private messageRepository: IMessageRepository) {}

  async execute(lobby_id: number, limit = 50): Promise<Message[]> {
    return await this.messageRepository.getByLobby(lobby_id, limit);
  }
}