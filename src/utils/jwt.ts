import jwt, { Secret, SignOptions } from 'jsonwebtoken';
import { getEnv } from '../projects/config/env';
import { Request } from 'express';

type JwtPayload = {
  id?: string;
  sub?: string;
  email?: string;
  role?: string;
};


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
  return verifyToken
}

export function jwtttoUserId(req: Request): string {
  const user = req.user as JwtPayload | undefined;

  const userIdFromReq = user?.sub || user?.id;

  if (userIdFromReq) {
    console.log('USER ID FROM REQ.USER ---->', userIdFromReq);
    return userIdFromReq;
  }

  const token =
    typeof req.query.token === 'string' ? req.query.token : undefined;

  if (!token) {
    throw new Error('User not authenticated');
  }

  const decoded = jwt.verify(token, getEnv('JWT_SECRET')) as JwtPayload;

  const userIdFromToken = decoded.sub || decoded.id;

  if (!userIdFromToken) {
    throw new Error('User not authenticated');
  }

  console.log('USER ID FROM QUERY TOKEN ---->', userIdFromToken);

  return userIdFromToken;
}