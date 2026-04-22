import { ILobbyRepository } from '../domain/ILobbyRepository';
import { LobbyMember } from '../domain/entities/LobbyMember';

export class JoinLobbyUseCase {
  constructor(private lobbyRepository: ILobbyRepository) {}

  async execute(lobby_id: number, user_id: number): Promise<LobbyMember> {
    const lobby = await this.lobbyRepository.getByID(lobby_id);
    if (!lobby) throw new Error('Lobby no encontrado');

    const already = await this.lobbyRepository.isMember(lobby_id, user_id);
    if (already) throw new Error('Ya eres miembro de este lobby');

    return await this.lobbyRepository.addMember(lobby_id, user_id);
  }
}