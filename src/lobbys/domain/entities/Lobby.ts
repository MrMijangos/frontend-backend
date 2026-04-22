export interface Lobby {
  id: number;
  name: string;
  description: string | null;
  image: string | null;
  owner_id: number;
  createdAt: Date;
}