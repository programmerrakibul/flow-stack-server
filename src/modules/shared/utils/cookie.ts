import type { Response } from "express";

import { getEnv, NODE_ENV } from "@/config/env";

const ACCESS_TOKEN_COOKIE_NAME = "__fs_access_token__";
const REFRESH_TOKEN_COOKIE_NAME = "__fs_refresh_token__";

const ACCESS_TOKEN_MAX_AGE = 15 * 60 * 1000;
const REFRESH_TOKEN_MAX_AGE = 7 * 24 * 60 * 60 * 1000;

const getCookieOptions = (maxAge: number) => {
  const env = getEnv();
  const inProduction = env.NODE_ENV === NODE_ENV.PRODUCTION;

  return {
    httpOnly: true,
    secure: inProduction,
    sameSite: inProduction ? "none" as const : "lax" as const,
    path: "/",
    maxAge,
  };
};

const setAccessCookie = (res: Response, token: string) => {
  res.cookie(ACCESS_TOKEN_COOKIE_NAME, token, getCookieOptions(ACCESS_TOKEN_MAX_AGE));
};

const setRefreshCookie = (res: Response, token: string) => {
  res.cookie(REFRESH_TOKEN_COOKIE_NAME, token, getCookieOptions(REFRESH_TOKEN_MAX_AGE));
};

const clearAccessCookie = (res: Response) => {
  res.clearCookie(ACCESS_TOKEN_COOKIE_NAME, { path: "/" });
};

const clearRefreshCookie = (res: Response) => {
  res.clearCookie(REFRESH_TOKEN_COOKIE_NAME, { path: "/" });
};

const clearAuthCookies = (res: Response) => {
  clearAccessCookie(res);
  clearRefreshCookie(res);
};

const cookieUtils = {
  ACCESS_TOKEN_COOKIE_NAME,
  REFRESH_TOKEN_COOKIE_NAME,
  setAccessCookie,
  setRefreshCookie,
  clearAccessCookie,
  clearRefreshCookie,
  clearAuthCookies,
};

export default cookieUtils;
