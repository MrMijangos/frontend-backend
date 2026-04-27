"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MarkAsReadUseCase = void 0;
class MarkAsReadUseCase {
    constructor(notificationRepository) {
        this.notificationRepository = notificationRepository;
    }
    async execute(id, user_id) {
        await this.notificationRepository.markAsRead(id, user_id);
    }
}
exports.MarkAsReadUseCase = MarkAsReadUseCase;
