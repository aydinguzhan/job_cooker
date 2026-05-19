import jwt, { Secret, SignOptions } from 'jsonwebtoken';
import { getEnv } from '../projects/config/env';
import { Request, Response } from 'express';
import { errorResponse } from './response';

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

export function verifyUserInfo(token: string) {
  const verifyToken = verifyAccessToken(token);
  console.log('---->', verifyToken.sub);
}

export function jwtttoUserId(req: Request): string {
  const user = req.user as
    | {
        id?: string;
        email?: string;
        role?: string;
        sub?: string;
      }
    | undefined;

  const userId = user?.sub || user?.id;

  if (!userId) {
    throw new Error("User not authenticated");
  }

  return userId;
}
