import NotificationsRepository from "./notification.repository";
import { db } from "../config/database";
import NotificationService from "./notification.service";
import NotifcationController from "./notifcation.controller";

const notificationRepository = new NotificationsRepository(db);
const notificationService = new NotificationService(notificationRepository);
const notifcationController = new NotifcationController(notificationService);

export default notifcationController