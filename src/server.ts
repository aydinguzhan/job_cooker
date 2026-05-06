import { checkDbConnection } from './projects/config/db-check';
import { connectMongo } from './projects/config/mongo-db';
import { connectRabbitMQ } from './shared/rabbitmq';

async function bootstrap() {
  await checkDbConnection();
  await connectMongo();
  await connectRabbitMQ();
}

bootstrap();
