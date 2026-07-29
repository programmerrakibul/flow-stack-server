import z from "zod";

export const querySchema = {
  page: z.string().optional(),
  limit: z.string().optional(),
  search: z.string().optional(),
};
