import { Notification } from './entities/Notification';

export interface INotificationRepository {
  save(notification: Omit<Notification, 'id' | 'createdAt'>): Promise<Notification>;
  getByUser(user_id: number): Promise<Notification[]>;
  getUnreadByUser(user_id: number): Promise<Notification[]>;
  markAsRead(id: number, user_id: number): Promise<void>;
  markAllAsRead(user_id: number): Promise<void>;
  delete(id: number, user_id: number): Promise<void>;
}