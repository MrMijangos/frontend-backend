import { ILobbyRepository } from '../domain/ILobbyRepository';
import { LobbyMember } from '../domain/entities/LobbyMember';

export class GetLobbyMembersUseCase {
  constructor(private lobbyRepository: ILobbyRepository) {}

  async execute(lobby_id: number): Promise<LobbyMember[]> {
    const lobby = await this.lobbyRepository.getByID(lobby_id);
    if (!lobby) throw new Error('Lobby no encontrado');
    return await this.lobbyRepository.getMembers(lobby_id);
  }
}