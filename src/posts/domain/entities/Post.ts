export interface Post {
  id: number;
  user_id: number;
  user_name?: string;
  user_avatar?: string | null;
  lobby_id: number | null;
  description: string | null;
  image_url?: string | null;
  createdAt: Date;
}