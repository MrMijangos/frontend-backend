"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MySQLMessageRepository = void 0;
const conn_1 = __importDefault(require("../../../core/config/conn"));
class MySQLMessageRepository {
    async save(message) {
        const [result] = await conn_1.default.execute(`INSERT INTO messages (lobby_id, user_id, content, sent_at) VALUES (?, ?, ?, NOW())`, [message.lobby_id, message.user_id, message.content]);
        const [rows] = await conn_1.default.execute(`SELECT m.*, u.name as user_name FROM messages m
       JOIN users u ON m.user_id = u.id
       WHERE m.id = ?`, [result.insertId]);
        return this.mapRow(rows[0]);
    }
    async getByLobby(lobby_id, limit = 50) {
        const [rows] = await conn_1.default.execute(`SELECT m.*, u.name as user_name FROM messages m
       JOIN users u ON m.user_id = u.id
       WHERE m.lobby_id = ? ORDER BY m.sent_at ASC LIMIT ${limit}`, [lobby_id]);
        return rows.map(row => this.mapRow(row));
    }
    async delete(id) {
        const [result] = await conn_1.default.execute('DELETE FROM messages WHERE id = ?', [id]);
        if (result.affectedRows === 0)
            throw new Error('Mensaje no encontrado');
    }
    mapRow(row) {
        return {
            id: row.id,
            lobby_id: row.lobby_id,
            user_id: row.user_id,
            user_name: row.user_name,
            content: row.content,
            sentAt: new Date(row.sent_at),
        };
    }
}
exports.MySQLMessageRepository = MySQLMessageRepository;
