export interface Message {
  id: number;
  lobby_id: number;
  user_id: number;
  user_name?: string;
  content: string;
  sentAt: Date;
}