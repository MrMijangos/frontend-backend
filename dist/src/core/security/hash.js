"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.hashPassword = hashPassword;
exports.checkPassword = checkPassword;
const bcrypt_1 = __importDefault(require("bcrypt"));
const SALT_ROUNDS = 10;
async function hashPassword(password) {
    const hash = await bcrypt_1.default.hash(password, SALT_ROUNDS);
    return hash;
}
async function checkPassword(hash, password) {
    const isValid = await bcrypt_1.default.compare(password, hash);
    return isValid;
}
