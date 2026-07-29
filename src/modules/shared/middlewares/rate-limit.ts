import prisma from "@/config/prisma";
import type { NextFunction, Request, Response } from "express";
import { TooManyRequestsError } from "http-errors-enhanced";
import { RateLimiterPrisma } from "rate-limiter-flexible";

const rateLimiter = new RateLimiterPrisma({
  storeClient: prisma,
  points: 100,
  duration: 15 * 60,
  blockDuration: 15 * 60,
  keyPrefix: "middleware",
});

export const rateLimit = async (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  try {
    await rateLimiter.consume(req.ip as string, 1);

    next();
  } catch {
    throw new TooManyRequestsError(
      "You have exceeded your request limit. Please try again later.",
    );
  }
};
