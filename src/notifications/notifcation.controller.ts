import NotificationService from './notification.service';

export default class NotifcationController {
  constructor(private readonly notifcationService: NotificationService) {}
  async getUserNotifications(receiverId: string) {
    return await this.notifcationService.getUserNotifications(receiverId);
  }
    async createNewNotification(payload: {
    receiverId: string;
    actorId: string;
    type: string;
    entityType: string;
    entityId: string;
    message: string;
  }) {
    return await this.notifcationService.createNewNotification(payload);
  }
}
