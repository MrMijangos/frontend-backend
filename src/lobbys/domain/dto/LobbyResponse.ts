export interface LobbyResponse {
  id: number;
  name: string;
  description: string | null;
  game: string;
  max_members: number;
  members_count: number;
  image: string | null;
  owner_id: number;
  owner_name: string;
  createdAt: string;
}

export interface LobbyMemberResponse {
  id: number;
  lobby_id: number;
  user_id: number;
  user_name: string;
  joinedAt: string;
}
