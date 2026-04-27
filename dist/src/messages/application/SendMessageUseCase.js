"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SendMessageUseCase = void 0;
class SendMessageUseCase {
    constructor(messageRepository) {
        this.messageRepository = messageRepository;
    }
    async execute(lobby_id, user_id, content) {
        if (!content?.trim())
            throw new Error('El mensaje no puede estar vacío');
        return await this.messageRepository.save({
            lobby_id,
            user_id,
            content: content.trim(),
        });
    }
}
exports.SendMessageUseCase = SendMessageUseCase;
