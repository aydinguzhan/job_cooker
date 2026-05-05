import { Database } from '../config/database';

export default class NotificationsRepository {
  constructor(private readonly db: Database) {}

  async getUserNotifications(receiverId: string) {
    const query = `SELECT receiver_id, actor_id, type, message, entity_id, created_at FROM notifications WHERE notifications.receiver_id = $1`;
    const { rows } = await this.db.query(query, [receiverId]);
    return rows;
  }
  async createNewNotification(payload: {
    receiverId: string;
    actorId: string;
    type: string;
    entityType: string;
    entityId: string;
    message: string;
  }) {
    const query = `INSERT INTO notifications (receiver_id, actor_id, type, entity_type, entity_id, message) VALUES ($1,$2,$3,$4,$5,$6)`;
    const { rows } = await this.db.query(query, [
      payload.receiverId,
      payload.actorId,
      payload.type,
      payload.entityType,
      payload.entityId,
      payload.message,
    ]);
    return rows
  }
}
