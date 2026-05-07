// src/workers/notification.worker.ts
import { connectRabbitMQ, getRabbitChannel } from '../../shared/rabbitmq';
import { getEnv } from '../../projects/config/env';
import { sendMail } from '../../lib/mail/mail.service';
import { userService } from '../../projects/user/user.module';
import AppError from '../../errors/AppError';

async function startNotificationWorker() {
  await connectRabbitMQ();

  const channel = getRabbitChannel();
  const emailQueueName = getEnv('RABBITMQ_EMAIL_NOTIFICATION_QUEUE');

  channel.prefetch(10);

  channel.consume(emailQueueName, async (msg) => {
    if (!msg) return;

    try {
      const data = JSON.parse(msg.content.toString());
      const { email } = await userService.getUser(data.receiver_id);
      await sendMail({
        to: email,
        subject: 'New Notification',
        text: data.message,
      });
      channel.ack(msg);
    } catch (error :any) {
      console.error('Email worker failed:', error);

      if (error.code === 'EAUTH') {
        channel.ack(msg); // tekrar deneme, Gmail'i kilitleme
        return;
      }

      channel.nack(msg, false, false);
    }
  });

  console.log('✅ Notification worker started');
}

startNotificationWorker();
