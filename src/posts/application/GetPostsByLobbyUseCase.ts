import { IPostRepository } from '../domain/IPostRepository';
import { Post } from '../domain/entities/Post';

export class GetPostsByLobbyUseCase {
  constructor(private postRepository: IPostRepository) {}

  async execute(lobby_id: number): Promise<Post[]> {
    return await this.postRepository.getByLobby(lobby_id);
  }
}