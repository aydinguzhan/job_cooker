import { timingSafeEqual } from "node:crypto";
import type { NextFunction, Request, Response } from "express";
import { getEnv } from "../projects/config/env";
import { authMiddleware } from "./auth.middeware";

/** Allows the cooker service token while preserving JWT auth for normal clients. */
export function jobSearchAuthMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const authorization = req.header("authorization") ?? "";
  const token = authorization.startsWith("Bearer ")
    ? authorization.slice("Bearer ".length)
    : "";
  const tokenBuffer = Buffer.from(token);
  const expectedTokenBuffer = Buffer.from(getEnv("COOKER_INGEST_TOKEN"));

  if (
    tokenBuffer.length > 0 &&
    tokenBuffer.length === expectedTokenBuffer.length &&
    timingSafeEqual(tokenBuffer, expectedTokenBuffer)
  ) {
    return next();
  }

  return authMiddleware(req, res, next);
}
