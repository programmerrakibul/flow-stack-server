import type { TSuccessResponse } from "@/shared/types";

import type { Response } from "express";

const success = <T>(
  res: Response,
  statusCode: number,
  data: Omit<TSuccessResponse<T>, "success">,
) => {
  res.status(statusCode).json({ success: true, ...data });
};

const error = (res: Response, statusCode: number, message: string) => {
  res.status(statusCode).json({ success: false, message });
};

const sendResponse = {
  success,
  error,
};

export default sendResponse;
