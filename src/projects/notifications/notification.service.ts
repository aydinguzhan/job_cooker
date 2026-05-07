import NotificationsRepository from './notification.repository';

export default class NotificationService {
  constructor(private readonly notificationRepository: NotificationsRepository) {}

  async getUserNotifications(receiverId: string) {
    return await this.notificationRepository.getUserNotifications(receiverId);
  }
  
  async createNewNotification(payload: {
    receiver_id: string;
    actor_id: string;
    type: string;
    entity_type: string;
    entity_id: string;
    message: string;
  }) {
    return await this.notificationRepository.createNewNotification(payload);
  }
}
