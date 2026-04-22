import { IMessageRepository } from '../domain/IMessageRepository';
import { Message } from '../domain/entities/Message';

export class SendMessageUseCase {
  constructor(private messageRepository: IMessageRepository) {}

  async execute(lobby_id: number, user_id: number, content: string): Promise<Message> {
    if (!content?.trim()) throw new Error('El mensaje no puede estar vacío');

    return await this.messageRepository.save({
      lobby_id,
      user_id,
      content: content.trim(),
    });
  }
}