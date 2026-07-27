import { getEnv } from "@/config/env";
import type { TJwtPayload } from "@/shared/types";

import jwt from "jsonwebtoken";

const generateAccessToken = (payload: TJwtPayload): string => {
  const env = getEnv();
  const user: TJwtPayload = {
    id: payload.id,
    email: payload.email,
    role: payload.role,
    emailVerified: payload.emailVerified,
  };

  return jwt.sign(user, env.JWT_ACCESS_SECRET, {
    expiresIn: env.JWT_ACCESS_EXPIRES_IN,
  } as jwt.SignOptions);
};

const generateRefreshToken = (payload: TJwtPayload): string => {
  const env = getEnv();
  const user: TJwtPayload = {
    id: payload.id,
    email: payload.email,
    role: payload.role,
    emailVerified: payload.emailVerified,
  };

  return jwt.sign(user, env.JWT_REFRESH_SECRET, {
    expiresIn: env.JWT_REFRESH_EXPIRES_IN,
  } as jwt.SignOptions);
};

const verifyAccessToken = (token: string): TJwtPayload => {
  const env = getEnv();

  return jwt.verify(token, env.JWT_ACCESS_SECRET) as TJwtPayload;
};

const verifyRefreshToken = (token: string): TJwtPayload => {
  const env = getEnv();

  return jwt.verify(token, env.JWT_REFRESH_SECRET) as TJwtPayload;
};

const jwtUtils = {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
};

export default jwtUtils;
