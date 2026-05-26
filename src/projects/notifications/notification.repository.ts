import { Database } from '../config/database';
import { INotificationPayload } from './notification.entity';

export default class NotificationsRepository {
  constructor(private readonly db: Database) {}

  async getUserNotifications(receiverId: string) {
    const query = `
      SELECT
        n.id,
        n.receiver_id,
        n.actor_id,
        n.type,
        n.title,
        n.message,
        n.entity_id,
        n.is_read,
        n.created_at,
        (u.first_name || ' ' || u.last_name) AS actor_full_name
      FROM notifications n
      LEFT JOIN users u
      ON n.actor_id = u.id
      WHERE n.receiver_id = $1
      ORDER BY n.created_at DESC
    `;
    const { rows } = await this.db.query(query, [receiverId]);
    return rows;
  }
  async createNewNotification(payload: INotificationPayload) {
    const query = `
      INSERT INTO notifications (receiver_id, actor_id, type, entity_type, entity_id, title, message)
      VALUES ($1,$2,$3,$4,$5,$6,$7)
      RETURNING id,receiver_id, actor_id, type, title, message, entity_id, is_read,created_at
    `;
    const { rows } = await this.db.query(query, [
      payload.receiver_id,
      payload.actor_id,
      payload.type,
      payload.entity_type,
      payload.entity_id,
      payload.title ?? null,
      payload.message,
    ]);
    const createdNotification = rows[0];

    const detailQuery = `
      SELECT
        n.id,
        n.receiver_id,
        n.actor_id,
        n.type,
        n.title,
        n.message,
        n.entity_id,
        n.is_read,
        n.created_at,
        (u.first_name || ' ' || u.last_name) AS actor_full_name
      FROM notifications n
      LEFT JOIN users u
      ON n.actor_id = u.id
      WHERE n.id = $1
    `;

    const { rows: detailRows } = await this.db.query(detailQuery, [createdNotification.id]);
    return detailRows[0];
  }
  async updateReadNotification(notification_id: string) {
    const query = `UPDATE notifications SET is_read =true WHERE id = $1 RETURNING *`;
    await this.db.query(query, [notification_id]);
  }
}
