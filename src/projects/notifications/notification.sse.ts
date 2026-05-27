import { Response } from 'express';



export default class NotificationSse {
  private notificationClients: Map<string, Set<Response>>;
  constructor() {
    this.notificationClients = new Map<string, Set<Response>>();
  }
  addNotificationClient(user_id: string, res: Response) {
    if (!this.notificationClients.has(user_id)) {
      this.notificationClients.set(user_id, new Set());
    }

    this.notificationClients.get(user_id)!.add(res);
  }
  removeNotificationClient(user_id: string, res: Response) {
    this.notificationClients.get(user_id)?.delete(res);
    if (this.notificationClients.get(user_id)?.size === 0) {
      this.notificationClients.delete(user_id);
    }
  }
  sendSseEvent(user_id: string, eventName: string, payload: unknown) {
    const clients = this.notificationClients.get(user_id);

    if (!clients) return;
    for (const res of clients) {
      res.write(`event: ${eventName}\n`);
      res.write(`data: ${JSON.stringify(payload)}\n\n`);
    }
  }
}
