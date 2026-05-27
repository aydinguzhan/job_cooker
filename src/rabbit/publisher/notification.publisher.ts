// src/notifications/notification.publisher.ts
import { getRabbitChannel } from '../../shared/rabbitmq';
import { getEnv } from '../../projects/config/env';
import { NotificationQueueJob } from '../types';

export function publishNotificationJob(payload: NotificationQueueJob) {
  const channel = getRabbitChannel();
  const queueName = getEnv('RABBITMQ_NOTIFICATION_QUEUE');

  channel.sendToQueue(queueName, Buffer.from(JSON.stringify(payload)), {
    persistent: true,
    contentType: 'application/json',
  });
}
