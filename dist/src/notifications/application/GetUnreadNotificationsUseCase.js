"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetUnreadNotificationsUseCase = void 0;
class GetUnreadNotificationsUseCase {
    constructor(notificationRepository) {
        this.notificationRepository = notificationRepository;
    }
    async execute(user_id) {
        return await this.notificationRepository.getUnreadByUser(user_id);
    }
}
exports.GetUnreadNotificationsUseCase = GetUnreadNotificationsUseCase;
