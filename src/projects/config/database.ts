import { Pool } from 'pg';
import { getEnv } from './env';

const dbConfig = {
  host: String(getEnv('DB_HOST')),
  port: Number(getEnv('DB_PORT')),
  user: String(getEnv('DB_USER')),
  password: String(getEnv('DB_PASSWORD')),
  database: String(getEnv('DB_NAME')),
};

export const db = new Pool(dbConfig);

export type Database = Pool;
