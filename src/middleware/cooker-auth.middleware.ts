import { timingSafeEqual } from "node:crypto";
import type { NextFunction, Request, Response } from "express";
import { getEnv } from "../projects/config/env";

export function cookerAuthMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const authorization = req.header("authorization");
  const token = authorization?.startsWith("Bearer ")
    ? authorization.slice("Bearer ".length)
    : "";
  const expectedToken = getEnv("COOKER_INGEST_TOKEN");
  const tokenBuffer = Buffer.from(token);
  const expectedTokenBuffer = Buffer.from(expectedToken);

  if (
    tokenBuffer.length !== expectedTokenBuffer.length ||
    !timingSafeEqual(tokenBuffer, expectedTokenBuffer)
  ) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  next();
}
