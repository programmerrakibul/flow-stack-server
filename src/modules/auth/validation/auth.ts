import z from "zod";

export const signUpSchema = z.object({
  name: z
    .string("Name is required")
    .trim()
    .min(1, "Name is required")
    .min(3, "Name must be at least 3 characters long")
    .max(50, "Name must be at most 50 characters long"),

  email: z
    .string("Email is required")
    .email("Invalid email")
    .trim()
    .min(1, "Email is required"),

  password: z
    .string("Password is required")
    .trim()
    .min(8, "Password must be at least 8 characters long")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/,
      "Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character",
    ),

  image: z
    .string()
    .url("Invalid image URL")
    .optional()
});

export const signInSchema = signUpSchema.pick({ email: true, password: true });

