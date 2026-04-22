import { ILobbyRepository } from '../domain/ILobbyRepository';
import { Lobby } from '../domain/entities/Lobby';

export class GetLobbyByIdUseCase {
  constructor(private lobbyRepository: ILobbyRepository) {}

  async execute(id: number): Promise<Lobby> {
    const lobby = await this.lobbyRepository.getByID(id);
    if (!lobby) throw new Error('Lobby no encontrado');
    return lobby;
  }
}