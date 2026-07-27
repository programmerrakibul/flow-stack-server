import type { NextFunction, Request, Response } from "express";
import { UnauthorizedError } from "http-errors-enhanced";

import cookieUtils from "@/shared/utils/cookie";
import jwtUtils from "@/shared/utils/jwt";

export const verifyAuth = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const token = req.cookies[cookieUtils.ACCESS_TOKEN_COOKIE_NAME] as
    | string
    | undefined;

  if (!token) {
    throw new UnauthorizedError("Unauthorized access");
  }

  try {
    const decoded = jwtUtils.verifyAccessToken(token);
    req.user = decoded;

    next();
  } catch {
    const refreshToken = req.cookies[cookieUtils.REFRESH_TOKEN_COOKIE_NAME] as
      | string
      | undefined;

    if (!refreshToken) {
      throw new UnauthorizedError("Invalid refresh token");
    }

    try {
      const decoded = jwtUtils.verifyRefreshToken(refreshToken);

      const newAccessToken = jwtUtils.generateAccessToken(decoded);
      const newRefreshToken = jwtUtils.generateRefreshToken(decoded);

      cookieUtils.setAccessCookie(res, newAccessToken);
      cookieUtils.setRefreshCookie(res, newRefreshToken);

      req.user = decoded;

      next();
    } catch {
      throw new UnauthorizedError("Unauthorized access");
    }
  }
};
