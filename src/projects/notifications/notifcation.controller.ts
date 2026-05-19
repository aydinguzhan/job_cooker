import NotificationService from './notification.service';

export default class NotifcationController {
  constructor(private readonly notifcationService: NotificationService) {}
  async getUserNotifications(receiver_id: string) {
    return await this.notifcationService.getUserNotifications(receiver_id);
  }
  async createNewNotification(payload: {
    receiver_id: string;
    actor_id: string;
    type: string;
    entity_type: string;
    entity_id: string;
    message: string;
  }) {
    return await this.notifcationService.createNewNotification(payload);
  }
}
