import type { NextFunction, Request, Response } from "express";
import { HttpError } from "http-errors-enhanced";
import status from "http-status";

import { getEnv, NODE_ENV } from "@/config/env";
import sendResponse from "@/modules/shared/utils/send-response";
import { ZodError } from "zod";

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

  if (err instanceof ZodError) {
    message = err.issues.map((issue) => issue.message).join(", ");
    statusCode = status.UNPROCESSABLE_ENTITY as number;
  }

  sendResponse.error(res, statusCode, message);
};
