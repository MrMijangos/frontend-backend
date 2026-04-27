export interface Lobby {
  id: number;
  name: string;
  description: string | null;
  game: string;
  max_members: number;
  image: string | null;
  owner_id: number;
  owner_name?: string;
  members_count?: number;
  createdAt: Date;
}