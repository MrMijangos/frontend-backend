export interface CreateLobbyRequest {
  name: string;
  description?: string;
  game: string;
  max_members: number;
  image?: string;
}

export interface UpdateLobbyRequest {
  name: string;
  description?: string;
  game?: string;
  max_members?: number;
  image?: string;
}
