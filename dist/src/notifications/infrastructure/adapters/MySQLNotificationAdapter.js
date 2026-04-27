"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MySQLNotificationRepository = void 0;
const conn_1 = __importDefault(require("../../../core/config/conn"));
class MySQLNotificationRepository {
    async save(notification) {
        const [result] = await conn_1.default.execute(`INSERT INTO notifications (user_id, type, payload, is_read, created_at)
       VALUES (?, ?, ?, 0, NOW())`, [
            notification.user_id,
            notification.type,
            notification.payload ? JSON.stringify(notification.payload) : null,
        ]);
        const [rows] = await conn_1.default.execute('SELECT * FROM notifications WHERE id = ?', [result.insertId]);
        return this.mapRow(rows[0]);
    }
    async getByUser(user_id) {
        const [rows] = await conn_1.default.execute('SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC', [user_id]);
        return rows.map(row => this.mapRow(row));
    }
    async getUnreadByUser(user_id) {
        const [rows] = await conn_1.default.execute('SELECT * FROM notifications WHERE user_id = ? AND is_read = 0 ORDER BY created_at DESC', [user_id]);
        return rows.map(row => this.mapRow(row));
    }
    async markAsRead(id, user_id) {
        const [result] = await conn_1.default.execute('UPDATE notifications SET is_read = 1 WHERE id = ? AND user_id = ?', [id, user_id]);
        if (result.affectedRows === 0)
            throw new Error('Notificación no encontrada');
    }
    async markAllAsRead(user_id) {
        await conn_1.default.execute('UPDATE notifications SET is_read = 1 WHERE user_id = ? AND is_read = 0', [user_id]);
    }
    async delete(id, user_id) {
        const [result] = await conn_1.default.execute('DELETE FROM notifications WHERE id = ? AND user_id = ?', [id, user_id]);
        if (result.affectedRows === 0)
            throw new Error('Notificación no encontrada');
    }
    mapRow(row) {
        return {
            id: row.id,
            user_id: row.user_id,
            type: row.type,
            payload: row.payload ? (typeof row.payload === 'string' ? JSON.parse(row.payload) : row.payload) : null,
            is_read: row.is_read === 1,
            createdAt: new Date(row.created_at),
        };
    }
}
exports.MySQLNotificationRepository = MySQLNotificationRepository;
