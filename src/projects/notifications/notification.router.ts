import express from 'express';
import { notifcationController } from './notification.module';

const notificationRouter = express.Router();

notificationRouter.get('/', notifcationController.getUserNotifications.bind(notifcationController));
notificationRouter.post(
  '/',
  notifcationController.createNewNotification.bind(notifcationController)
);

export default notificationRouter;
