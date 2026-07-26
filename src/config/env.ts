import "dotenv/config";
import { UnprocessableEntityError } from "http-errors-enhanced";
import z from "zod";

export const NODE_ENV = {
  DEVELOPMENT: "development",
  TEST: "test",
  PRODUCTION: "production",
} as const;

const envSchema = z.object({
  NODE_ENV: z.enum(Object.values(NODE_ENV)).default(NODE_ENV.DEVELOPMENT),

  DATABASE_URL: z
    .string("DATABASE_URL is required")
    .trim()
    .min(1, "DATABASE_URL is required"),

  PORT: z.coerce.number().default(8000),

  SESSION_SECRET: z
    .string("SESSION_SECRET is required")
    .trim()
    .min(1, "SESSION_SECRET is required"),
});

export const getEnv = () => {
  const { data, error, success } = envSchema.safeParse(process.env);

  if (!success) {
    const errorMessages = error.issues.map((issue) => issue.message).join(", ");

    throw new UnprocessableEntityError(errorMessages);
  }

  return data;
};
