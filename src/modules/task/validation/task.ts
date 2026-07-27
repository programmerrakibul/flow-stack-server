import { Priority, Status } from "@/generated/prisma/enums";
import z from "zod";

export const createTaskSchema = z.object({
  title: z
    .string("Title is required")
    .trim()
    .min(1, "Title is required")
    .min(3, "Title must be at least 3 characters long")
    .max(255, "Title must be at most 255 characters long"),

  description: z
    .string("Description is required")
    .trim()
    .min(1, "Description is required"),

  priority: z.nativeEnum(Priority, `Priority must be one of ${Object.values(Priority).join(", ")}`).default(Priority.LOW),
});

export const updateTaskSchema =createTaskSchema.partial();

export const updateTaskStatusSchema = z.object({
  status: z.nativeEnum(Status),
});

export const taskQuerySchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  search: z.string().optional(),
  status: z.nativeEnum(Status).optional(),
  priority: z.nativeEnum(Priority).optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
});
