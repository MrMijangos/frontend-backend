"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MySQLPostRepository = void 0;
const conn_1 = __importDefault(require("../../../core/config/conn"));
class MySQLPostRepository {
    constructor() {
        this.SELECT_WITH_USER = `
    SELECT p.*, u.name as user_name, u.profile_picture as user_avatar,
      (SELECT image_url FROM post_images WHERE post_id = p.id LIMIT 1) as image_url
    FROM posts p JOIN users u ON p.user_id = u.id`;
    }
    async save(post) {
        const [result] = await conn_1.default.execute(`INSERT INTO posts (user_id, lobby_id, description, created_at) VALUES (?, ?, ?, NOW())`, [post.user_id, post.lobby_id ?? null, post.description ?? null]);
        const [rows] = await conn_1.default.execute(`${this.SELECT_WITH_USER} WHERE p.id = ?`, [result.insertId]);
        return this.mapRow(rows[0]);
    }
    async getByID(id) {
        const [rows] = await conn_1.default.execute(`${this.SELECT_WITH_USER} WHERE p.id = ?`, [id]);
        if (rows.length === 0)
            return null;
        return this.mapRow(rows[0]);
    }
    async getAll() {
        const [rows] = await conn_1.default.execute(`${this.SELECT_WITH_USER} ORDER BY p.created_at DESC`);
        return rows.map(row => this.mapRow(row));
    }
    async getByUser(user_id) {
        const [rows] = await conn_1.default.execute(`${this.SELECT_WITH_USER} WHERE p.user_id = ? ORDER BY p.created_at DESC`, [user_id]);
        return rows.map(row => this.mapRow(row));
    }
    async getByLobby(lobby_id) {
        const [rows] = await conn_1.default.execute(`${this.SELECT_WITH_USER} WHERE p.lobby_id = ? ORDER BY p.created_at DESC`, [lobby_id]);
        return rows.map(row => this.mapRow(row));
    }
    async update(post) {
        const [result] = await conn_1.default.execute('UPDATE posts SET description = ? WHERE id = ?', [post.description ?? null, post.id]);
        if (result.affectedRows === 0)
            throw new Error('Post no encontrado');
    }
    async delete(id) {
        const [result] = await conn_1.default.execute('DELETE FROM posts WHERE id = ?', [id]);
        if (result.affectedRows === 0)
            throw new Error('Post no encontrado');
    }
    mapRow(row) {
        return {
            id: row.id,
            user_id: row.user_id,
            user_name: row.user_name,
            user_avatar: row.user_avatar ?? null,
            lobby_id: row.lobby_id ?? null,
            description: row.description ?? null,
            image_url: row.image_url ?? null,
            createdAt: new Date(row.created_at),
        };
    }
}
exports.MySQLPostRepository = MySQLPostRepository;
