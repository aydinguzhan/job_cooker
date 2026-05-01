import jwt, { Secret, SignOptions } from 'jsonwebtoken';
import { getEnv } from '../config/env';

export interface JwtPayload {
  sub: string;
  email: string;
  role: string;
}

export function singAccessToken(payload: JwtPayload): string {
  return jwt.sign(payload, getEnv('JWT_SECRET') as Secret, {
    expiresIn: getEnv('JWT_EXPIRES_IN') as SignOptions['expiresIn'],
  });
}

export function verifyAccessToken(token: string): JwtPayload {
  return jwt.verify(token, getEnv('JWT_SECRET') as Secret) as JwtPayload;
}
