import { ILobbyRepository } from '../domain/ILobbyRepository';
import { Lobby } from '../domain/entities/Lobby';

export class GetAllLobbysUseCase {
  constructor(private lobbyRepository: ILobbyRepository) {}

  async execute(): Promise<Lobby[]> {
    return await this.lobbyRepository.getAll();
  }
}