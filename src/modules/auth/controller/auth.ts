import type { Request, Response } from "express";

import services from "@/auth/service/auth";
import { getEnv, NODE_ENV } from "@/config/env";
import sendResponse from "@/shared/utils/sendResponse";
import status from "http-status";

const signUp = async (req: Request, res: Response) => {
  const result = await services.signUp(req.body);

  req.session.user = {
    id: result.id,
    email: result.email,
    role: result.role,
    emailVerified: result.emailVerified,
  };

  sendResponse.success(res, status.CREATED, {
    message: "User registered successfully",
    data: result,
  });
};

const signIn = async (req: Request, res: Response) => {
  const result = await services.signIn(req.body);

  req.session.user = {
    id: result.id,
    email: result.email,
    role: result.role,
    emailVerified: result.emailVerified,
  };

  sendResponse.success(res, status.OK, {
    message: "User logged in successfully",
    data: result,
  });
};

const signOut = (req: Request, res: Response) => {
  const inProduction = getEnv().NODE_ENV === NODE_ENV.PRODUCTION;

  req.session.destroy((err: unknown) => {
    if (err) {
      throw err;
    }
  });

  res.clearCookie("flow_stack_sid", {
    path: "/",
    httpOnly: true,
    secure: inProduction,
    sameSite: inProduction ? "none" : "lax",
  });

  sendResponse.success(res, status.OK, {
    message: "User logged out successfully",
  });
};

const profile = async (req: Request, res: Response) => {
  const id = req.session.user!.id;

  const result = await services.profile(id);

  sendResponse.success(res, status.OK, {
    message: "User profile fetched successfully",
    data: result,
  });
};

const controllers = {
  signUp,
  signIn,
  signOut,
  profile,
};

export default controllers;
