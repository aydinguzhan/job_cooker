import NotificationsRepository from './notification.repository';

export default class NotificationService {
  constructor(private readonly notificationRepository: NotificationsRepository) {}

  async getUserNotifications(receiverId: string) {
    return await this.notificationRepository.getUserNotifications(receiverId);
  }
  async createNewNotification(payload: {
    receiverId: string;
    actorId: string;
    type: string;
    entityType: string;
    entityId: string;
    message: string;
  }) {
    return await this.notificationRepository.createNewNotification(payload);
  }
}
