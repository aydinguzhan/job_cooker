import { INotificationPayload } from './notification.entity';
import NotificationsRepository from './notification.repository';
import NotificationSse from './notification.sse';
export default class NotificationService {
  constructor(
    private readonly notificationRepository: NotificationsRepository,
    private readonly notificationSse: NotificationSse
  ) {}

  async getUserNotifications(receiverId: string) {
    return await this.notificationRepository.getUserNotifications(receiverId);
  }

  async createNewNotification(payload: INotificationPayload) {
    const notification = await this.notificationRepository.createNewNotification(payload);

    try {
      this.notificationSse.sendSseEvent(payload.receiver_id, 'notification.created', notification);
    } catch (error) {
      console.error('SSE notification send failed:', error);
    }

    return notification;
  }
  async updateReadNotification(notification_id:string){
    await this.notificationRepository.updateReadNotification(notification_id)
  }
}
