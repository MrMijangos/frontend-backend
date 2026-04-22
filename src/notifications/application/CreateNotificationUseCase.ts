import { INotificationRepository } from '../domain/INotificationRepository';
import { Notification } from '../domain/entities/Notification';

export class CreateNotificationUseCase {
  constructor(private notificationRepository: INotificationRepository) {}

  async execute(
    user_id: number,
    type: string,
    payload?: Record<string, any>
  ): Promise<Notification> {
    if (!type?.trim()) throw new Error('El tipo de notificación es obligatorio');

    return await this.notificationRepository.save({
      user_id,
      type,
      payload: payload ?? null,
      is_read: false,
    });
  }
}