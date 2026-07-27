import type { TJwtPayload } from "@/shared/types";

declare global {
  namespace Express {
    interface Request {
      user: TJwtPayload;
    }
  }
}
