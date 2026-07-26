import { type Express, type Request, type Response } from "express";
import { status } from "http-status";

import sendResponse from "@/shared/utils/sendResponse";

const API_PREFIX = "/api/v1" as const;

const mountedRoutes = (app: Express) => {
  app.get("/", (_req: Request, res: Response) => {
    sendResponse.success(res, status.OK, {
      message: "Welcome to Flowstack API",
    });
  });
};

export default mountedRoutes;
