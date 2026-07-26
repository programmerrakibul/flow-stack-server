import type { NextFunction, Request, Response } from "express";
import { HttpError } from "http-errors-enhanced";
import status from "http-status";

import { getEnv, NODE_ENV } from "@/config/env";
import sendResponse from "@/shared/utils/sendResponse";

const env = getEnv();

export const globalErrorHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  if (env.NODE_ENV !== NODE_ENV.PRODUCTION) {
    console.error(`Global error handler: ${err}`);
  }

  let statusCode = status.INTERNAL_SERVER_ERROR as number;
  let message = "Internal server error";

  if (err instanceof HttpError) {
    statusCode = err.statusCode;
    message = err.message;
  }

  sendResponse.error(res, statusCode, message);
};
