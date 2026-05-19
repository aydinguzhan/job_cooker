// src/workers/notification.worker.ts
import { connectRabbitMQ, getRabbitChannel } from '../../shared/rabbitmq';
import { getEnv } from '../../projects/config/env';
import { notificationService } from '../../projects/notifications/notification.module';

async function startNotificationWorker() {
  await connectRabbitMQ();

  const channel = getRabbitChannel();
  const queueName = getEnv('RABBITMQ_NOTIFICATION_QUEUE');

  channel.prefetch(10);
  channel.consume(queueName, async (msg) => {
    if (!msg) return;

    try {
      const data = JSON.parse(msg.content.toString());

      await notificationService.createNewNotification({
        receiver_id: data.receiver_id,
        actor_id: data.actor_id,
        type: data.type,
        entity_type: data.entity_type,
        entity_id: data.entity_id,
        message: data.message,
      });

      channel.ack(msg);
    } catch (error) {
      console.error('Notification worker failed:', error);
      channel.nack(msg, false, true);
    }
  });

  console.log('✅ Notification worker started');
}

startNotificationWorker();
