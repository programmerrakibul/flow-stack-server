import { type Express, type Request, type Response } from "express";
import { status } from "http-status";

import authRouter from "@/auth/routes/auth";
import dashboardRouter from "@/dashboard/routes/dashboard";
import sendResponse from "@/modules/shared/utils/send-response";
import { globalErrorHandler } from "@/shared/middlewares/global-error-handler";
import { rateLimit } from "@/shared/middlewares/rate-limit";
import taskRouter from "@/task/routes/task";
import userRouter from "@/user/routes/user";

const API_PREFIX = "/api/v1" as const;

const mountedRoutes = (app: Express) => {
  app.get("/", (req: Request, res: Response) => {
    console.log(req.ip);
    sendResponse.success(res, status.OK, {
      message: "Welcome to Flowstack API",
    });
  });

  app.use(rateLimit);

  app.use(`${API_PREFIX}/auth`, authRouter);
  app.use(`${API_PREFIX}/users`, userRouter);
  app.use(`${API_PREFIX}/tasks`, taskRouter);
  app.use(`${API_PREFIX}/dashboard`, dashboardRouter);

  app.use((_req: Request, res: Response) => {
    sendResponse.error(res, status.NOT_FOUND, "Route not found");
  });

  app.use(globalErrorHandler);
};

export default mountedRoutes;
