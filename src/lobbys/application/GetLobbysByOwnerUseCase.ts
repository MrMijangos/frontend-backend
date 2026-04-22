import { ILobbyRepository } from '../domain/ILobbyRepository';
import { Lobby } from '../domain/entities/Lobby';

export class GetLobbysByOwnerUseCase {
  constructor(private lobbyRepository: ILobbyRepository) {}

  async execute(owner_id: number): Promise<Lobby[]> {
    return await this.lobbyRepository.getByOwner(owner_id);
  }
}