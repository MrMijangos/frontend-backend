import { IPostRepository } from '../domain/IPostRepository';
import { Post } from '../domain/entities/Post';
import { UpdatePostRequest } from '../domain/dto/PostRequest';

export class UpdatePostUseCase {
  constructor(private postRepository: IPostRepository) {}

  async execute(id: number, user_id: number, request: UpdatePostRequest): Promise<Post> {
    const existing = await this.postRepository.getByID(id);
    if (!existing) throw new Error('Post no encontrado');
    if (existing.user_id !== user_id) throw new Error('No tienes permiso para editar este post');

    const updated: Post = {
      ...existing,
      description: request.description?.trim() ?? existing.description,
    };

    await this.postRepository.update(updated);
    return updated;
  }
}