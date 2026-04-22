export interface CreateLobbyRequest {
  name: string;
  description?: string;
  image?: string;
}

export interface UpdateLobbyRequest {
  name: string;
  description?: string;
  image?: string;
}