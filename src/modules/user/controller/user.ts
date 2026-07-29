import sendResponse from "@/shared/utils/send-response";
import services from "@/user/service/user";

import type { Request, Response } from "express";
import status from "http-status";

const listUsers = async (req: Request, res: Response) => {
  const result = await services.listUsers(req.query);

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


const deleteUser = async (req: Request<{ id: string }>, res: Response) => {
  const result = await services.deleteUser(req.params.id);

  sendResponse.success(res, status.OK, {
    message: result.message,
  });
};

const controllers = {
  listUsers,
  toggleUserActive,
  deleteUser,
};

export default controllers;
