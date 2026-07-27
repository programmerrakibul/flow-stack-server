import type { User } from "@/generated/prisma/client";

export type TTaskCreator = Pick<User, "id" | "role">;
