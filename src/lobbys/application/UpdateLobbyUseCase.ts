import { ILobbyRepository } from '../domain/ILobbyRepository';
import { Lobby } from '../domain/entities/Lobby';
import { UpdateLobbyRequest } from '../domain/dto/LobbyRequest';

export class UpdateLobbyUseCase {
  constructor(private lobbyRepository: ILobbyRepository) {}

  async execute(id: number, owner_id: number, request: UpdateLobbyRequest): Promise<Lobby> {
    const existing = await this.lobbyRepository.getByID(id);
    if (!existing) throw new Error('Lobby no encontrado');
    if (existing.owner_id !== owner_id) throw new Error('No tienes permiso para editar este lobby');
    if (!request.name?.trim()) throw new Error('El nombre del lobby es obligatorio');

    const updated: Lobby = {
      ...existing,
      name: request.name.trim(),
      description: request.description?.trim() || null,
      game: request.game?.trim() || existing.game,
      max_members: request.max_members ?? existing.max_members,
      image: request.image !== undefined ? request.image : existing.image,
    };

    await this.lobbyRepository.update(updated);
    return updated;
  }
}
