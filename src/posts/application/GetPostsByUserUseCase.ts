import { IPostRepository } from '../domain/IPostRepository';
import { Post } from '../domain/entities/Post';

export class GetPostsByUserUseCase {
  constructor(private postRepository: IPostRepository) {}

  async execute(user_id: number): Promise<Post[]> {
    return await this.postRepository.getByUser(user_id);
  }
}