import { db } from './database';

export const checkDbConnection = async () => {
  try {
    await db.query('SELECT 1');
    //  await connectMongo();
    console.log('✅ Database connected');
  } catch (error) {
    console.error('❌ Database connection failed', error);
    process.exit(1);
  }
};