import { INotificationRepository } from '../domain/INotificationRepository';

export class MarkAsReadUseCase {
  constructor(private notificationRepository: INotificationRepository) {}

  async execute(id: number, user_id: number): Promise<void> {
    await this.notificationRepository.markAsRead(id, user_id);
  }
}