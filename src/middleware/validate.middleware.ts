import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';
import { errorResponse } from '../utils/response';

export const validate =
  (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse({
      body: req.body,
      query: req.query,
      params: req.params,
    });

    if (!result.success) {
      const formattedError = Object.values(result.error.flatten().fieldErrors).flat().join(', ');
      return errorResponse(res, 'Validation error', 400, formattedError);
    }

    next();
  };
