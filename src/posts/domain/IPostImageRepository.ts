import { PostImage } from './entities/PostImage';

export interface IPostImageRepository {
  saveMany(post_id: number, image_urls: string[]): Promise<PostImage[]>;
  getByPost(post_id: number): Promise<PostImage[]>;
  delete(id: number): Promise<void>;
  deleteByPost(post_id: number): Promise<void>;
}