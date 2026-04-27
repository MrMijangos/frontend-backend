"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MarkAllAsReadUseCase = void 0;
class MarkAllAsReadUseCase {
    constructor(notificationRepository) {
        this.notificationRepository = notificationRepository;
    }
    async execute(user_id) {
        await this.notificationRepository.markAllAsRead(user_id);
    }
}
exports.MarkAllAsReadUseCase = MarkAllAsReadUseCase;
