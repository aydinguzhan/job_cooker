import { Request, Response, NextFunction } from 'express';
import { errorResponse } from '../utils/response';
import jwt from 'jsonwebtoken';
import { getEnv } from '../projects/config/env';
type JwtPayload = {
  id: string;
  email: string;
  role?: string;
};

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader)
    return errorResponse(res, 'Unauthorized', 401, 'Authorization header is missing');

  const [type, token] = authHeader.split(' ');

  if (type !== 'Bearer' || !token) {
    return errorResponse(res, 'Unauthorized', 401, 'Invalid authorization format');
  }

  try {
    const decoded = jwt.verify(token, getEnv('JWT_SECRET')) as JwtPayload;
    req.user = decoded;
    next();
  } catch {
    return errorResponse(res, 'Unauthorized', 401, 'Invalid or expired token');
  }
};

export const sseAuthMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const token = req.query.token as string | undefined;

  if (!token) {
    return errorResponse(res, "Unauthorized", 401, "Token is missing");
  }

  try {
    const decoded = jwt.verify(token, getEnv("JWT_SECRET")) as JwtPayload;
    req.user = decoded;
    next();
  } catch {
    return errorResponse(res, "Unauthorized", 401, "Invalid or expired token");
  }
};