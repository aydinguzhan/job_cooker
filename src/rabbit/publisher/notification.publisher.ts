// src/notifications/notification.publisher.ts
import { getRabbitChannel } from '../../shared/rabbitmq';
import { getEnv } from '../../projects/config/env';
import { NotificationJob } from '../types';

export function publishNotificationJob(payload: NotificationJob) {
  const channel = getRabbitChannel();
  const queueName = getEnv('RABBITMQ_NOTIFICATION_QUEUE');

  channel.sendToQueue(queueName, Buffer.from(JSON.stringify(payload)), {
    persistent: true,
    contentType: 'application/json',
  });
}
