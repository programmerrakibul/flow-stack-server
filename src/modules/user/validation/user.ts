import { querySchema } from "@/shared/validation/query";
import z from "zod";

export const userQuerySchema = z.object(querySchema);
