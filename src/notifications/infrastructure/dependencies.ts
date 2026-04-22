import { MySQLNotificationRepository } from './adapters/MySQLNotificationAdapter';
import { CreateNotificationUseCase } from '../application/CreateNotificationUseCase';
import { GetNotificationsUseCase } from '../application/GetNotificationsUseCase';
import { GetUnreadNotificationsUseCase } from '../application/GetUnreadNotificationsUseCase';
import { MarkAsReadUseCase } from '../application/MarkAsReadUseCase';
import { MarkAllAsReadUseCase } from '../application/MarkAllAsReadUseCase';
import { DeleteNotificationUseCase } from '../application/DeleteNotificationUseCase';
import { GetNotificationsController } from './controllers/GetNotificationsController';
import { GetUnreadNotificationsController } from './controllers/GetUnreadNotificationsController';
import { MarkAsReadController } from './controllers/MarkAsReadController';
import { MarkAllAsReadController } from './controllers/MarkAllAsReadController';
import { DeleteNotificationController } from './controllers/DeleteNotificationController';

const notificationRepository = new MySQLNotificationRepository();

export const createNotificationUseCase = new CreateNotificationUseCase(notificationRepository);

const getNotificationsUseCase       = new GetNotificationsUseCase(notificationRepository);
const getUnreadNotificationsUseCase = new GetUnreadNotificationsUseCase(notificationRepository);
const markAsReadUseCase             = new MarkAsReadUseCase(notificationRepository);
const markAllAsReadUseCase          = new MarkAllAsReadUseCase(notificationRepository);
const deleteNotificationUseCase     = new DeleteNotificationUseCase(notificationRepository);

export const getNotificationsController       = new GetNotificationsController(getNotificationsUseCase);
export const getUnreadNotificationsController = new GetUnreadNotificationsController(getUnreadNotificationsUseCase);
export const markAsReadController             = new MarkAsReadController(markAsReadUseCase);
export const markAllAsReadController          = new MarkAllAsReadController(markAllAsReadUseCase);
export const deleteNotificationController     = new DeleteNotificationController(deleteNotificationUseCase);