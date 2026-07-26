import { type Express, type Request, type Response } from "express";
import { status } from "http-status";

import authRouter from "@/auth/routes/auth";
import taskRouter from "@/task/routes/task";
import dashboardRouter from "@/dashboard/routes/dashboard";
import { globalErrorHandler } from "@/shared/middlewares/global-error-handler";
import sendResponse from "@/shared/utils/sendResponse";

const API_PREFIX = "/api/v1" as const;

const mountedRoutes = (app: Express) => {
  app.get("/", (_req: Request, res: Response) => {
    sendResponse.success(res, status.OK, {
      message: "Welcome to Flowstack API",
    });
  });

  app.use(`${API_PREFIX}/auth`, authRouter);
  app.use(`${API_PREFIX}/tasks`, taskRouter);
  app.use(`${API_PREFIX}/dashboard`, dashboardRouter);

  app.use(globalErrorHandler);
};

export default mountedRoutes;
