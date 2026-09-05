import { checkDbConnection } from './projects/config/db-check';
import { connectMongo } from './projects/config/mongo-db';
import { connectRabbitMQ } from './shared/rabbitmq';
import { startNotificationConsumer } from './rabbit/workers/notification.worker';
import { db } from './projects/config/database';

const seed = async () => {
  const query = `
  CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subject VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE conversation_members (
  conversation_id UUID REFERENCES conversations(id),
  user_id UUID REFERENCES users(id),
  PRIMARY KEY (conversation_id, user_id)
);

CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES conversations(id),
  sender_id UUID REFERENCES users(id),
  body TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE message_reads (
  message_id UUID REFERENCES messages(id),
  user_id UUID REFERENCES users(id),
  read_at TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY (message_id, user_id)
);

CREATE TABLE qr_login_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  session_code TEXT NOT NULL UNIQUE,
  pin_code VARCHAR(4),
  used_at TIMESTAMP NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
`;

  try {
    await db.query(query);
  } catch (error) {
    console.error('Error seeding database', error);
  }

};

async function bootstrap() {
  await checkDbConnection();
  await connectMongo();
  await connectRabbitMQ();
  await startNotificationConsumer();
  // await seed();
  console.log('🚀 Server is running');
}

bootstrap();
