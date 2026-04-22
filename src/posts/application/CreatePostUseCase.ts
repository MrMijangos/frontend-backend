import { IPostRepository } from '../domain/IPostRepository';
import { Post } from '../domain/entities/Post';
import { CreatePostRequest } from '../domain/dto/PostRequest';

export class CreatePostUseCase {
  constructor(private postRepository: IPostRepository) {}

  async execute(user_id: number, request: CreatePostRequest): Promise<Post> {
    if (!request.description?.trim() && !request.lobby_id) {
      throw new Error('El post debe tener descripción o pertenecer a un lobby');
    }

    const newPost: Omit<Post, 'id' | 'createdAt'> = {
      user_id,
      lobby_id: request.lobby_id ?? null,
      description: request.description?.trim() || null,
    };

    return await this.postRepository.save(newPost);
  }
}