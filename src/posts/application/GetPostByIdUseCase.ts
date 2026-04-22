import { IPostRepository } from '../domain/IPostRepository';
import { Post } from '../domain/entities/Post';

export class GetPostByIdUseCase {
  constructor(private postRepository: IPostRepository) {}

  async execute(id: number): Promise<Post> {
    const post = await this.postRepository.getByID(id);
    if (!post) throw new Error('Post no encontrado');
    return post;
  }
}