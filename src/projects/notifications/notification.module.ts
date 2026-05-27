import NotificationsRepository from './notification.repository';
import { db } from '../config/database';
import NotificationService from './notification.service';
import NotifcationController from './notifcation.controller';
import NotificationSse from './notification.sse';

const notifcationSseService = new NotificationSse();
const notificationRepository = new NotificationsRepository(db);
const notificationService = new NotificationService(notificationRepository, notifcationSseService);
const notifcationController = new NotifcationController(notificationService, notifcationSseService);

export { notifcationController, notificationService, notificationRepository };
