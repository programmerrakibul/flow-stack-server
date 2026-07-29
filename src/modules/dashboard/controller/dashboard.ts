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

const listUsers = async (req: Request, res: Response) => {
  const result = await services.listUsers(req.query as Record<string, string>);

  sendResponse.success(res, status.OK, {
    message: "Users fetched successfully",
    data: result.users,
    pagination: result.pagination,
  });
};

const toggleUserActive = async (req: Request, res: Response) => {
  const result = await services.toggleUserActive(req.params.id as string);

  sendResponse.success(res, status.OK, {
    message: "User status toggled successfully",
    data: result,
  });
};

const deleteUser = async (req: Request, res: Response) => {
  const result = await services.deleteUser(req.params.id as string);

  sendResponse.success(res, status.OK, {
    message: result.message,
  });
};

const controllers = {
  getUserDashboard,
  getAdminDashboard,
  listUsers,
  toggleUserActive,
  deleteUser,
};

export default controllers;
