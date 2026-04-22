import { IPostRepository } from '../domain/IPostRepository';

export class DeletePostUseCase {
  constructor(private postRepository: IPostRepository) {}

  async execute(id: number, user_id: number): Promise<void> {
    const existing = await this.postRepository.getByID(id);
    if (!existing) throw new Error('Post no encontrado');
    if (existing.user_id !== user_id) throw new Error('No tienes permiso para eliminar este post');
    await this.postRepository.delete(id);
  }
}