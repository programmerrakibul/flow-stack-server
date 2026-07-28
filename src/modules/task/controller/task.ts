import type { Request, Response } from "express";

import sendResponse from "@/modules/shared/utils/send-response";
import services from "@/task/service/task";
import status from "http-status";

const create = async (req: Request, res: Response) => {
  const creatorId = req.user.id;
  const result = await services.create(creatorId, req.body);

  sendResponse.success(res, status.CREATED, {
    message: "Task created successfully",
    data: result,
  });
};

const list = async (req: Request, res: Response) => {
  const creator = {
    id: req.user.id,
    role: req.user.role,
  };

  const result = await services.list(creator, req.query);

  sendResponse.success(res, status.OK, {
    message: "Tasks fetched successfully",
    data: result.tasks,
    pagination: result.pagination,
  });
};

const getById = async (req: Request, res: Response) => {
  const creator = {
    id: req.user.id,
    role: req.user.role,
  };

  const result = await services.getById(creator, req.params.id as string);

  sendResponse.success(res, status.OK, {
    message: "Task fetched successfully",
    data: result,
  });
};

const update = async (req: Request, res: Response) => {
  const creator = {
    id: req.user.id,
    role: req.user.role,
  };

  const result = await services.update(
    creator,
    req.params.id as string,
    req.body,
  );

  sendResponse.success(res, status.OK, {
    message: "Task updated successfully",
    data: result,
  });
};

const updateStatus = async (req: Request, res: Response) => {
  const creator = {
    id: req.user.id,
    role: req.user.role,
  };

  const result = await services.updateStatus(
    creator,
    req.params.id as string,
    req.body,
  );

  sendResponse.success(res, status.OK, {
    message: "Task status updated successfully",
    data: result,
  });
};

const remove = async (req: Request, res: Response) => {
  const creator = {
    id: req.user.id,
    role: req.user.role,
  };

  const result = await services.remove(creator, req.params.id as string);

  sendResponse.success(res, status.OK, {
    message: result.message,
  });
};

const controllers = {
  create,
  list,
  getById,
  update,
  updateStatus,
  remove,
};

export default controllers;
