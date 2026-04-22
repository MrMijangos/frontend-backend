import { IPostImageRepository } from '../domain/IPostImageRepository';
import { IPostRepository } from '../domain/IPostRepository';

export class DeletePostImageUseCase {
  constructor(
    private postRepository: IPostRepository,
    private postImageRepository: IPostImageRepository,
  ) {}

  async execute(post_id: number, image_id: number, user_id: number): Promise<void> {
    const post = await this.postRepository.getByID(post_id);
    if (!post) throw new Error('Post no encontrado');
    if (post.user_id !== user_id) throw new Error('No tienes permiso para eliminar imágenes de este post');
    await this.postImageRepository.delete(image_id);
  }
}