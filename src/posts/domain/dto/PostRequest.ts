export interface CreatePostRequest {
  lobby_id?: number;
  description?: string;
}

export interface UpdatePostRequest {
  description?: string;
}