export interface PostResponse {
  id: number;
  user_id: number;
  lobby_id: number | null;
  description: string | null;
  createdAt: string;
}