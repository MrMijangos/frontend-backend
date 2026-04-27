"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MySQLUserRepository = void 0;
const conn_1 = __importDefault(require("../../../core/config/conn"));
class MySQLUserRepository {
    async save(user) {
        const query = `
      INSERT INTO users (name, secondname, lastname, secondlastname, email, password, profile_picture, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, NOW())
    `;
        const [result] = await conn_1.default.execute(query, [
            user.name, user.secondname, user.lastname, user.secondlastname,
            user.email, user.password, user.profile_picture ?? null,
        ]);
        const [rows] = await conn_1.default.execute('SELECT * FROM users WHERE id = ?', [result.insertId]);
        return this.mapRow(rows[0]);
    }
    async getByEmail(email) {
        const [rows] = await conn_1.default.execute('SELECT * FROM users WHERE email = ?', [email]);
        if (rows.length === 0)
            return null;
        return this.mapRow(rows[0]);
    }
    async getByID(id) {
        const [rows] = await conn_1.default.execute('SELECT * FROM users WHERE id = ?', [id]);
        if (rows.length === 0)
            return null;
        return this.mapRow(rows[0]);
    }
    async getAll() {
        const [rows] = await conn_1.default.execute('SELECT * FROM users ORDER BY created_at DESC');
        return rows.map(row => this.mapRow(row));
    }
    async update(user) {
        const query = `
      UPDATE users
      SET name = ?, secondname = ?, lastname = ?, secondlastname = ?, email = ?, password = ?, profile_picture = ?
      WHERE id = ?
    `;
        const [result] = await conn_1.default.execute(query, [
            user.name, user.secondname, user.lastname, user.secondlastname,
            user.email, user.password, user.profile_picture ?? null, user.id,
        ]);
        if (result.affectedRows === 0)
            throw new Error('Usuario no encontrado');
    }
    async delete(id) {
        const [result] = await conn_1.default.execute('DELETE FROM users WHERE id = ?', [id]);
        if (result.affectedRows === 0)
            throw new Error('Usuario no encontrado');
    }
    async getTotal() {
        const [rows] = await conn_1.default.execute('SELECT COUNT(*) as total FROM users');
        return rows[0].total;
    }
    mapRow(row) {
        return {
            id: row.id,
            name: row.name,
            secondname: row.secondname ?? null,
            lastname: row.lastname,
            secondlastname: row.secondlastname ?? null,
            email: row.email,
            password: row.password,
            profile_picture: row.profile_picture ?? null,
            createdAt: new Date(row.created_at),
        };
    }
}
exports.MySQLUserRepository = MySQLUserRepository;
