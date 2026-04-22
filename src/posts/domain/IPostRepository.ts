import { Post } from './entities/Post';

export interface IPostRepository {
  save(post: Omit<Post, 'id' | 'createdAt'>): Promise<Post>;
  getByID(id: number): Promise<Post | null>;
  getAll(): Promise<Post[]>;
  getByUser(user_id: number): Promise<Post[]>;
  getByLobby(lobby_id: number): Promise<Post[]>;
  update(post: Post): Promise<void>;
  delete(id: number): Promise<void>;
}