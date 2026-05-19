import { Request, Response, NextFunction } from 'express';
import AppError from '../errors/AppError';

export enum ErrorCode {
  USER_NOT_FOUND = 'USER_NOT_FOUND',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
}

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('ERROR NAME:', err.name);
  console.error('ERROR MESSAGE:', err.message);
  console.error('ERROR STACK:', err.stack);
  console.error('FULL ERROR:', err);

  if (err instanceof AppError) {
    return res.status(err.statusCode).send({
      success: false,
      code: err.code,
      message: err.message,
    });
  }

  return res.status(500).send({
    success: false,
    code: 'INTERNAL_SERVER_ERROR',
    message: err.message || 'Something went wrong',
  });
};
