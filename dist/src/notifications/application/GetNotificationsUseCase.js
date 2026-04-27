"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetNotificationsUseCase = void 0;
class GetNotificationsUseCase {
    constructor(notificationRepository) {
        this.notificationRepository = notificationRepository;
    }
    async execute(user_id) {
        return await this.notificationRepository.getByUser(user_id);
    }
}
exports.GetNotificationsUseCase = GetNotificationsUseCase;
