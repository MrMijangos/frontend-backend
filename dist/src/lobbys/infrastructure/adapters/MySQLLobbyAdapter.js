"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MySQLLobbyRepository = void 0;
const conn_1 = __importDefault(require("../../../core/config/conn"));
class MySQLLobbyRepository {
    async save(lobby) {
        const query = `
      INSERT INTO lobbys (name, description, game, max_members, image, owner_id, created_at)
      VALUES (?, ?, ?, ?, ?, ?, NOW())
    `;
        const [result] = await conn_1.default.execute(query, [
            lobby.name, lobby.description, lobby.game, lobby.max_members, lobby.image, lobby.owner_id,
        ]);
        const [rows] = await conn_1.default.execute(`SELECT l.*, u.name as owner_name, COUNT(lm.id) as members_count
       FROM lobbys l
       LEFT JOIN users u ON l.owner_id = u.id
       LEFT JOIN lobby_members lm ON l.id = lm.lobby_id
       WHERE l.id = ?
       GROUP BY l.id`, [result.insertId]);
        return this.mapLobby(rows[0]);
    }
    async getByID(id) {
        const [rows] = await conn_1.default.execute(`SELECT l.*, u.name as owner_name, COUNT(lm.id) as members_count
       FROM lobbys l
       LEFT JOIN users u ON l.owner_id = u.id
       LEFT JOIN lobby_members lm ON l.id = lm.lobby_id
       WHERE l.id = ?
       GROUP BY l.id`, [id]);
        if (rows.length === 0)
            return null;
        return this.mapLobby(rows[0]);
    }
    async getAll() {
        const [rows] = await conn_1.default.execute(`SELECT l.*, u.name as owner_name, COUNT(lm.id) as members_count
       FROM lobbys l
       LEFT JOIN users u ON l.owner_id = u.id
       LEFT JOIN lobby_members lm ON l.id = lm.lobby_id
       GROUP BY l.id
       ORDER BY l.created_at DESC`);
        return rows.map(row => this.mapLobby(row));
    }
    async getByOwner(owner_id) {
        const [rows] = await conn_1.default.execute(`SELECT l.*, u.name as owner_name, COUNT(lm.id) as members_count
       FROM lobbys l
       LEFT JOIN users u ON l.owner_id = u.id
       LEFT JOIN lobby_members lm ON l.id = lm.lobby_id
       WHERE l.owner_id = ?
       GROUP BY l.id
       ORDER BY l.created_at DESC`, [owner_id]);
        return rows.map(row => this.mapLobby(row));
    }
    async update(lobby) {
        const query = `
      UPDATE lobbys SET name = ?, description = ?, game = ?, max_members = ?, image = ? WHERE id = ?
    `;
        const [result] = await conn_1.default.execute(query, [
            lobby.name, lobby.description, lobby.game, lobby.max_members, lobby.image, lobby.id,
        ]);
        if (result.affectedRows === 0)
            throw new Error('Lobby no encontrado');
    }
    async delete(id) {
        const [result] = await conn_1.default.execute('DELETE FROM lobbys WHERE id = ?', [id]);
        if (result.affectedRows === 0)
            throw new Error('Lobby no encontrado');
    }
    async addMember(lobby_id, user_id) {
        const query = `INSERT INTO lobby_members (lobby_id, user_id, joined_at) VALUES (?, ?, NOW())`;
        const [result] = await conn_1.default.execute(query, [lobby_id, user_id]);
        const [rows] = await conn_1.default.execute(`SELECT lm.*, u.name as user_name
       FROM lobby_members lm
       JOIN users u ON lm.user_id = u.id
       WHERE lm.id = ?`, [result.insertId]);
        return this.mapMember(rows[0]);
    }
    async removeMember(lobby_id, user_id) {
        const [result] = await conn_1.default.execute('DELETE FROM lobby_members WHERE lobby_id = ? AND user_id = ?', [lobby_id, user_id]);
        if (result.affectedRows === 0)
            throw new Error('Miembro no encontrado');
    }
    async getMembers(lobby_id) {
        const [rows] = await conn_1.default.execute(`SELECT lm.*, u.name as user_name
       FROM lobby_members lm
       JOIN users u ON lm.user_id = u.id
       WHERE lm.lobby_id = ?
       ORDER BY lm.joined_at ASC`, [lobby_id]);
        return rows.map(row => this.mapMember(row));
    }
    async isMember(lobby_id, user_id) {
        const [rows] = await conn_1.default.execute('SELECT id FROM lobby_members WHERE lobby_id = ? AND user_id = ?', [lobby_id, user_id]);
        return rows.length > 0;
    }
    mapLobby(row) {
        return {
            id: row.id,
            name: row.name,
            description: row.description ?? null,
            game: row.game ?? 'General',
            max_members: row.max_members ?? 10,
            image: row.image ?? null,
            owner_id: row.owner_id,
            owner_name: row.owner_name ?? undefined,
            members_count: Number(row.members_count ?? 0),
            createdAt: new Date(row.created_at),
        };
    }
    mapMember(row) {
        return {
            id: row.id,
            lobby_id: row.lobby_id,
            user_id: row.user_id,
            user_name: row.user_name ?? undefined,
            joinedAt: new Date(row.joined_at),
        };
    }
}
exports.MySQLLobbyRepository = MySQLLobbyRepository;
