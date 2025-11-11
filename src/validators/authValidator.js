import z from "zod";

export const registerSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .email({ message: "Invalid email format" })
    .toLowerCase()
    .trim(),
  password: z
    .string({ required_error: "Password is required" })
    .min(2, { message: "Password must be at least 6 characters" })
    .max(100, { message: "Password must not exceed 100 characters" }),
  firstName: z
    .string({ required_error: "First name is required" })
    .min(2, { message: "First name must be at least 2 characters" })
    .max(50, { message: "First name must not exceed 50 characters" })
    .regex(/^[a-zA-Z ]+$/, {
      message: "First name must contain only alphabetic characters",
    })
    .trim(),
  lastName: z
    .string()
    .min(2, { message: "Last name must be at lease 2 characters" })
    .max(50, { message: "Last name must not exceed 50 characters" })
    .regex(/^[a-zA-Z\s]+$/, {
      message: "Last name must contain only alphabetic characters",
    })
    .trim()
    .optional(),
  role: z.enum(["user", "admin"]).optional(),
});

export const loginSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .email({ message: "Invalid email format" })
    .toLowerCase()
    .trim(),
  password: z.string({ required_error: "Password is required" }),
});
