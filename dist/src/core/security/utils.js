"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateRandomString = generateRandomString;
exports.trimString = trimString;
exports.sanitizeEmail = sanitizeEmail;
exports.isValidEmail = isValidEmail;
const crypto_1 = __importDefault(require("crypto"));
function generateRandomString(length) {
    const bytes = Math.ceil(length / 2);
    const buffer = crypto_1.default.randomBytes(bytes);
    return buffer.toString('hex').slice(0, length);
}
function trimString(str) {
    return str.trim();
}
function sanitizeEmail(email) {
    return email.toLowerCase().trim();
}
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}
