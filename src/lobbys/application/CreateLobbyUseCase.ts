import { ILobbyRepository } from '../domain/ILobbyRepository';
import { Lobby } from '../domain/entities/Lobby';
import { CreateLobbyRequest } from '../domain/dto/LobbyRequest';

export class CreateLobbyUseCase {
  constructor(private lobbyRepository: ILobbyRepository) {}

  async execute(owner_id: number, request: CreateLobbyRequest): Promise<Lobby> {
    if (!request.name?.trim()) throw new Error('El nombre del lobby es obligatorio');

    const newLobby: Omit<Lobby, 'id' | 'createdAt'> = {
      name: request.name.trim(),
      description: request.description?.trim() || null,
      image: request.image || null,
      owner_id,
    };

    return await this.lobbyRepository.save(newLobby);
  }
}