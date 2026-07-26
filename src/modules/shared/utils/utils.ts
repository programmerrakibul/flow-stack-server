import type z from "zod";

export const parseOrThrow = <T>(schema: z.ZodSchema<T>, payload: unknown): T => {
  const result = schema.parse(payload);

  return result;
};
