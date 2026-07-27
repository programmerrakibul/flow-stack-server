import type { Request, Response } from "express";

import services from "@/auth/service/auth";
import cookieUtils from "@/shared/utils/cookie";
import jwtUtils from "@/shared/utils/jwt";
import sendResponse from "@/shared/utils/sendResponse";
import status from "http-status";

const signUp = async (req: Request, res: Response) => {
  const result = await services.signUp(req.body);

  const payload = {
    id: result.id,
    email: result.email,
    role: result.role,
    emailVerified: result.emailVerified,
  };

  const accessToken = jwtUtils.generateAccessToken(payload);
  const refreshToken = jwtUtils.generateRefreshToken(payload);

  cookieUtils.setAccessCookie(res, accessToken);
  cookieUtils.setRefreshCookie(res, refreshToken);

  sendResponse.success(res, status.CREATED, {
    message: "User registered successfully",
    data: result,
  });
};

const signIn = async (req: Request, res: Response) => {
  const result = await services.signIn(req.body);

  const payload = {
    id: result.id,
    email: result.email,
    role: result.role,
    emailVerified: result.emailVerified,
  };

  const accessToken = jwtUtils.generateAccessToken(payload);
  const refreshToken = jwtUtils.generateRefreshToken(payload);

  cookieUtils.setAccessCookie(res, accessToken);
  cookieUtils.setRefreshCookie(res, refreshToken);

  sendResponse.success(res, status.OK, {
    message: "User logged in successfully",
    data: result,
  });
};

const signOut = (_req: Request, res: Response) => {
  cookieUtils.clearAuthCookies(res);

  sendResponse.success(res, status.OK, {
    message: "User logged out successfully",
  });
};

const refreshToken = async (req: Request, res: Response) => {
  const token = req.cookies[cookieUtils.REFRESH_TOKEN_COOKIE_NAME];

  if (!token) {
    sendResponse.success(res, status.OK, {
      message: "Refresh token not found",
    });

    return;
  }

  const decoded = jwtUtils.verifyRefreshToken(token);

  const accessToken = jwtUtils.generateAccessToken(decoded);
  const newRefreshToken = jwtUtils.generateRefreshToken(decoded);

  cookieUtils.setAccessCookie(res, accessToken);
  cookieUtils.setRefreshCookie(res, newRefreshToken);

  sendResponse.success(res, status.OK, {
    message: "Token refreshed successfully",
  });
};

const profile = async (req: Request, res: Response) => {
  const result = await services.profile(req.user.id);

  sendResponse.success(res, status.OK, {
    message: "User profile fetched successfully",
    data: result,
  });
};

const controllers = {
  signUp,
  signIn,
  signOut,
  refreshToken,
  profile,
};

export default controllers;
