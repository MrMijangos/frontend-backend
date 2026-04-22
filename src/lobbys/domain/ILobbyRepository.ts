import { Lobby } from './entities/Lobby';
import { LobbyMember } from './entities/LobbyMember';

export interface ILobbyRepository {
  save(lobby: Omit<Lobby, 'id' | 'createdAt'>): Promise<Lobby>;
  getByID(id: number): Promise<Lobby | null>;
  getAll(): Promise<Lobby[]>;
  getByOwner(owner_id: number): Promise<Lobby[]>;
  update(lobby: Lobby): Promise<void>;
  delete(id: number): Promise<void>;
  addMember(lobby_id: number, user_id: number): Promise<LobbyMember>;
  removeMember(lobby_id: number, user_id: number): Promise<void>;
  getMembers(lobby_id: number): Promise<LobbyMember[]>;
  isMember(lobby_id: number, user_id: number): Promise<boolean>;
}