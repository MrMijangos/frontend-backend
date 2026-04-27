"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MySQLPostImageRepository = void 0;
const conn_1 = __importDefault(require("../../../core/config/conn"));
class MySQLPostImageRepository {
    async saveMany(post_id, image_urls) {
        const saved = [];
        for (const url of image_urls) {
            const [result] = await conn_1.default.execute('INSERT INTO post_images (post_id, image_url) VALUES (?, ?)', [post_id, url]);
            saved.push({ id: result.insertId, post_id, image_url: url });
        }
        return saved;
    }
    async getByPost(post_id) {
        const [rows] = await conn_1.default.execute('SELECT * FROM post_images WHERE post_id = ?', [post_id]);
        return rows.map(row => ({ id: row.id, post_id: row.post_id, image_url: row.image_url }));
    }
    async delete(id) {
        const [result] = await conn_1.default.execute('DELETE FROM post_images WHERE id = ?', [id]);
        if (result.affectedRows === 0)
            throw new Error('Imagen no encontrada');
    }
    async deleteByPost(post_id) {
        await conn_1.default.execute('DELETE FROM post_images WHERE post_id = ?', [post_id]);
    }
}
exports.MySQLPostImageRepository = MySQLPostImageRepository;
