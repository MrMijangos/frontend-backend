import { INotificationRepository } from '../domain/INotificationRepository';
import { Notification } from '../domain/entities/Notification';

export class GetNotificationsUseCase {
  constructor(private notificationRepository: INotificationRepository) {}

  async execute(user_id: number): Promise<Notification[]> {
    return await this.notificationRepository.getByUser(user_id);
  }
}