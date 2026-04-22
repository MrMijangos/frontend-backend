import { IPostRepository } from '../domain/IPostRepository';
import { Post } from '../domain/entities/Post';

export class GetAllPostsUseCase {
  constructor(private postRepository: IPostRepository) {}

  async execute(): Promise<Post[]> {
    return await this.postRepository.getAll();
  }
}