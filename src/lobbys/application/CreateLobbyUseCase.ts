import { ILobbyRepository } from '../domain/ILobbyRepository';
import { Lobby } from '../domain/entities/Lobby';
import { CreateLobbyRequest } from '../domain/dto/LobbyRequest';

export class CreateLobbyUseCase {
  constructor(private lobbyRepository: ILobbyRepository) {}

  async execute(owner_id: number, request: CreateLobbyRequest): Promise<Lobby> {
    if (!request.name?.trim()) throw new Error('El nombre del lobby es obligatorio');
    if (!request.game?.trim()) throw new Error('El juego es obligatorio');

    const newLobby: Omit<Lobby, 'id' | 'createdAt' | 'owner_name' | 'members_count'> = {
      name: request.name.trim(),
      description: request.description?.trim() || null,
      game: request.game.trim(),
      max_members: request.max_members || 10,
      image: request.image || null,
      owner_id,
    };

    return await this.lobbyRepository.save(newLobby);
  }
}
