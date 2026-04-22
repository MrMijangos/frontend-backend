export interface Notification {
  id: number;
  user_id: number;
  type: string;
  payload: Record<string, any> | null;
  is_read: boolean;
  createdAt: Date;
}