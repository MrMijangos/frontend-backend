"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateNotificationUseCase = void 0;
class CreateNotificationUseCase {
    constructor(notificationRepository) {
        this.notificationRepository = notificationRepository;
    }
    async execute(user_id, type, payload) {
        if (!type?.trim())
            throw new Error('El tipo de notificación es obligatorio');
        return await this.notificationRepository.save({
            user_id,
            type,
            payload: payload ?? null,
            is_read: false,
        });
    }
}
exports.CreateNotificationUseCase = CreateNotificationUseCase;
