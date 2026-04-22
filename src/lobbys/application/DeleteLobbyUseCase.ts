import { ILobbyRepository } from '../domain/ILobbyRepository';

export class DeleteLobbyUseCase {
  constructor(private lobbyRepository: ILobbyRepository) {}

  async execute(id: number, owner_id: number): Promise<void> {
    const existing = await this.lobbyRepository.getByID(id);
    if (!existing) throw new Error('Lobby no encontrado');
    if (existing.owner_id !== owner_id) throw new Error('No tienes permiso para eliminar este lobby');
    await this.lobbyRepository.delete(id);
  }
}