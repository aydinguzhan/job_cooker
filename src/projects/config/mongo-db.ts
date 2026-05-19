import { MongoClient, Db } from 'mongodb';
import { getEnv } from './env';

const uri = getEnv('MONGO_URI');
const dbName = getEnv('MONGO_DB_NAME');

let client: MongoClient | null = null;

let mongoClientPromise: Promise<MongoClient> | null = null;

let mongoDbPromise: Promise<Db> | null = null;

export async function connectMongo(): Promise<MongoClient> {
  if (mongoClientPromise) {
    return mongoClientPromise;
  }

  client = new MongoClient(uri, {
    maxPoolSize: 50,
    minPoolSize: 5,
    serverSelectionTimeoutMS: 10000,
    socketTimeoutMS: 50000,
    connectTimeoutMS: 10000,
  });

  mongoClientPromise = client.connect();

  await mongoClientPromise;

  console.log('✅ Mongo Connect');

  return mongoClientPromise;
}

export async function getMongoDb(): Promise<Db> {
  if (mongoDbPromise) {
    return mongoDbPromise;
  }

  mongoDbPromise = (async () => {
    const client = await connectMongo();

    return client.db(dbName);
  })();

  return mongoDbPromise;
}
