import type { NextFunction, Request, Response } from "express";
import { UnauthorizedError } from "http-errors-enhanced";

export const verifySessionId = (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  const { user } = req.session;

  if (!user) {
    throw new UnauthorizedError("Unauthorized access");
  }

  next();
};
