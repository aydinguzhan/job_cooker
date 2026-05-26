import { Request, Response } from 'express';
import { INotificationPayload } from './notification.entity';
import NotificationService from './notification.service';
import { jwtttoUserId } from '../../utils/jwt';
import NotificationSse from './notification.sse';

export default class NotifcationController {
  constructor(
    private readonly notifcationService: NotificationService,
    private readonly notificationSse: NotificationSse
  ) {}
  async getUserNotifications(req: Request, res: Response) {
    const receiver_id = jwtttoUserId(req);
    const results = await this.notifcationService.getUserNotifications(receiver_id);
    return res.json(results);
  }
  async createNewNotification(req: Request, res: Response) {
    const payload = req.body as INotificationPayload;
    const receiver_id = jwtttoUserId(req);
    payload.receiver_id = receiver_id;
    const results = await this.notifcationService.createNewNotification(payload);
    return res.json(results);
  }
  async subscribeToNotifications(req: Request, res: Response) {
    const user_id = jwtttoUserId(req);
    console.log(`User ${user_id} connected to notification SSE`);

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache, no-transform');
    res.setHeader('Connection', 'keep-alive');

    this.notificationSse.addNotificationClient(user_id, res);

    res.write(`event: connected\n`);
    res.write(`data: ${JSON.stringify({ message: 'connected' })}\n\n`);

    const heartbeat = setInterval(() => {
      res.write(`event: ping\n`);
      res.write(`data: ${JSON.stringify({ time: Date.now() })}\n\n`);
    }, 25_000);

    req.on('close', () => {
      clearInterval(heartbeat);
      this.notificationSse.removeNotificationClient(user_id, res);
      res.end();
    });
  }
  async updateReadNotification(req: Request, res: Response) {
    const { notificationId } = req.params;
    await this.notifcationService.updateReadNotification(notificationId as string);
    return res.status(200).send(true);
  }
}
