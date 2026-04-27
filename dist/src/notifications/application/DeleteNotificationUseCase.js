"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteNotificationUseCase = void 0;
class DeleteNotificationUseCase {
    constructor(notificationRepository) {
        this.notificationRepository = notificationRepository;
    }
    async execute(id, user_id) {
        await this.notificationRepository.delete(id, user_id);
    }
}
exports.DeleteNotificationUseCase = DeleteNotificationUseCase;
