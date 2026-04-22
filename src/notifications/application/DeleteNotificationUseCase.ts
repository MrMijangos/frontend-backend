import { INotificationRepository } from '../domain/INotificationRepository';

export class DeleteNotificationUseCase {
  constructor(private notificationRepository: INotificationRepository) {}

  async execute(id: number, user_id: number): Promise<void> {
    await this.notificationRepository.delete(id, user_id);
  }
}