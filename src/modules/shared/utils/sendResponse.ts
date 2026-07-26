import type { Response } from "express";
import status from "http-status";
import type { TSuccessResponse } from "../types";

const success = <T>(
  res: Response,
  statusCode: number = status.OK,
  data: Omit<TSuccessResponse<T>, "success">,
) => {
  res.status(statusCode).json({ success: true, ...data });
};

const error = (
  res: Response,
  statusCode: number = status.INTERNAL_SERVER_ERROR,
  message: string = "Internal server error",
) => {
  res.status(statusCode).json({ success: false, message });
};

const sendResponse = {
  success,
  error,
};

export default sendResponse;
