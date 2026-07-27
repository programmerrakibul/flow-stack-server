import type { Role } from "@/generated/prisma/enums";
import type { NextFunction, Request, Response } from "express";
import { ForbiddenError } from "http-errors-enhanced";

export const authorize = (...allowedRoles: Role[]) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    const { user } = req;

    if (!user || !allowedRoles.includes(user.role)) {
      throw new ForbiddenError(
        "You don't have permission to perform this action",
      );
    }

    next();
  };
};
