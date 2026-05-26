import express from 'express';
import { notifcationController } from './notification.module';
import { authMiddleware } from '../../middleware/auth.middeware';

const notificationRouter = express.Router();

notificationRouter.get(
  '/',
  authMiddleware,
  notifcationController.getUserNotifications.bind(notifcationController)
);
notificationRouter.post(
  '/',
  authMiddleware,
  notifcationController.createNewNotification.bind(notifcationController)
);
notificationRouter.get(
  '/events',
  notifcationController.subscribeToNotifications.bind(notifcationController)
);

notificationRouter.get(
  '/read/:notificationId',
  notifcationController.updateReadNotification.bind(notifcationController)
);

export default notificationRouter;
