import z from "zod";

export const toggleUserActiveSchema = z.object({
  isActive: z.boolean("isActive must be a boolean"),
});

export const deleteUserSchema = z.object({
  id: z.string("User ID is required").uuid("Invalid user ID"),
});
