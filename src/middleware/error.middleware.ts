import { Request, Response, NextFunction } from 'express';
import AppError from '../errors/AppError';

export enum ErrorCode {
  USER_NOT_FOUND = 'USER_NOT_FOUND',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
}
export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).send({
      code: err.code,
      message: err.message,
    });
  }
  return res.status(500).send({
    code: 'INTERNAL_SERVER_ERROR',
    message: 'Something went wrng',
  });
};
