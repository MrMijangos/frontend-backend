export interface LobbyMember {
  id: number;
  lobby_id: number;
  user_id: number;
  user_name?: string;
  joinedAt: Date;
}