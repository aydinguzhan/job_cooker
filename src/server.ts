import { checkDbConnection } from './projects/config/db-check';
import { connectMongo } from './projects/config/mongo-db';
import { connectRabbitMQ } from './shared/rabbitmq';
import { startNotificationConsumer } from './rabbit/workers/notification.worker';

async function bootstrap() {
  await checkDbConnection();
  await connectMongo();
  await connectRabbitMQ();
  await startNotificationConsumer();
}

bootstrap();
