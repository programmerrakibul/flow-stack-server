import type { User } from "@/generated/prisma/client";
import "express-session";

declare module "express-session" {
  interface SessionData {
    user: Pick<User, "id" | "email" | "role" | "emailVerified">;
  }
}
