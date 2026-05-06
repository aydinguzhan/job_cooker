import amqp from 'amqplib';
import { getEnv } from '../../projects/config/env';

let channel: amqp.Channel | null = null;

export async function connectRabbitMQ() {
  const connection = await amqp.connect(getEnv('RABBITMQ_URL'));

  channel = await connection.createChannel();

  await channel.assertQueue(getEnv('RABBITMQ_NOTIFICATION_QUEUE'), {
    durable: true,
  });
  await channel.assertQueue(getEnv('RABBITMQ_EMAIL_NOTIFICATION_QUEUE'), {
    durable: true,
  });
  console.log('✅ RabbitMQ connected');
}

export function getRabbitChannel() {
  if (!channel) {
    throw new Error('RabbitMQ channel is not initialized');
  }

  return channel;
}
