// src/database/mongo.ts
import { MongoClient, Db } from 'mongodb';
import { getEnv } from './env';

const uri = getEnv('MONGO_URI');
const dbName = getEnv('MONGO_DB_NAME');

let client: MongoClient;
let mongoDb: Promise<Db> | null = null;
const mongoClientPromise: Promise<MongoClient> | null = null;

export async function connectMongo(): Promise<MongoClient> {
  if (mongoClientPromise) return mongoClientPromise;
  client = new MongoClient(uri, {
    maxPoolSize: 50,
    minPoolSize: 5,
    serverSelectionTimeoutMS: 10000,
    socketTimeoutMS: 50000,
    connectTimeoutMS: 10000,
  });
  await client.connect();
  return client;
}

export async function getMongoDb(): Promise<Db> {
  if (mongoDb) return mongoDb;

  mongoDb = (async () => {
    const client = await connectMongo();
    const db = client.db(dbName);
    console.log('Mongo Connect');
    return db;
  })();
  const db = await connectMongo();
  if (!db) throw new Error('Mongo not connected');
  return mongoDb;
}
