import { IPostImageRepository } from '../domain/IPostImageRepository';
import { IPostRepository } from '../domain/IPostRepository';
import { PostImage } from '../domain/entities/PostImage';

export class AddPostImagesUseCase {
  constructor(
    private postRepository: IPostRepository,
    private postImageRepository: IPostImageRepository,
  ) {}

  async execute(post_id: number, user_id: number, image_urls: string[]): Promise<PostImage[]> {
    const post = await this.postRepository.getByID(post_id);
    if (!post) throw new Error('Post no encontrado');
    if (post.user_id !== user_id) throw new Error('No tienes permiso para editar este post');
    if (image_urls.length === 0) throw new Error('Debes enviar al menos una imagen');

    return await this.postImageRepository.saveMany(post_id, image_urls);
  }
}