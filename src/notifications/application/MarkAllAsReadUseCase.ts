import { INotificationRepository } from '../domain/INotificationRepository';

export class MarkAllAsReadUseCase {
  constructor(private notificationRepository: INotificationRepository) {}

  async execute(user_id: number): Promise<void> {
    await this.notificationRepository.markAllAsRead(user_id);
  }
}