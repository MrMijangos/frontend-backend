import { IPostImageRepository } from '../domain/IPostImageRepository';
import { PostImage } from '../domain/entities/PostImage';

export class GetPostImagesUseCase {
  constructor(private postImageRepository: IPostImageRepository) {}

  async execute(post_id: number): Promise<PostImage[]> {
    return await this.postImageRepository.getByPost(post_id);
  }
}