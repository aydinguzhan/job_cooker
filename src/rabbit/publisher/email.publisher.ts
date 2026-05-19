import { getRabbitChannel } from '../../shared/rabbitmq';
import { getEnv } from '../../projects/config/env';
import { NotificationJob } from '../types';
export function publishEmailNotificationJob(payload: NotificationJob) {
  const channel = getRabbitChannel();
  const queueName = getEnv('RABBITMQ_EMAIL_NOTIFICATION_QUEUE');
  channel.sendToQueue(queueName, Buffer.from(JSON.stringify(payload)), {
    persistent: true,
    contentType: 'application/json',
  });
}
