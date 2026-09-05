// src/types/express.d.ts

declare namespace Express {
  export interface Request {
    user?: {
      sub?: string,
      id: string;
      email: string;
      role?: string;
    };
  }
}
