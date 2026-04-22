export interface NotificationResponse {
  id: number;
  user_id: number;
  type: string;
  payload: Record<string, any> | null;
  is_read: boolean;
  createdAt: string;
}