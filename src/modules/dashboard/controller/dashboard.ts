import type { Request, Response } from "express";

import services from "@/dashboard/service/dashboard";
import sendResponse from "@/modules/shared/utils/send-response";
import status from "http-status";

const getUserDashboard = async (req: Request, res: Response) => {
  const userId = req.user.id;
  const result = await services.getUserDashboard(userId);

  sendResponse.success(res, status.OK, {
    message: "User dashboard fetched successfully",
    data: result,
  });
};

const getAdminDashboard = async (_req: Request, res: Response) => {
  const result = await services.getAdminDashboard();

  sendResponse.success(res, status.OK, {
    message: "Admin dashboard fetched successfully",
    data: result,
  });
};

const controllers = {
  getUserDashboard,
  getAdminDashboard,
};

export default controllers;
