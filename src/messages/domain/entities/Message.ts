export interface Message {
  id: number;
  lobby_id: number;
  user_id: number;
  content: string;
  sentAt: Date;
}