import dotEnv from 'dotenv';
dotEnv.config();

export function getEnv(key: string): string {
  const envValue = process.env[key];

  if (!envValue) {
    throw new Error(`Missing environment variable: ${key}`);
  }

  return envValue;
}