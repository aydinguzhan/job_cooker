import { getRabbitChannel } from '../../shared/rabbitmq';
import { getEnv } from '../../projects/config/env';
import { EmailNotificationJob } from '../types';
export function publishEmailNotificationJob(payload: EmailNotificationJob) {
  const channel = getRabbitChannel();
  const queueName = getEnv('RABBITMQ_EMAIL_NOTIFICATION_QUEUE');
  channel.sendToQueue(queueName, Buffer.from(JSON.stringify(payload)), {
    persistent: true,
    contentType: 'application/json',
  });
}
