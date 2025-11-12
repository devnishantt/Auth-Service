import z from "zod";

export const registerSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .email({ message: "Invalid email format" })
    .toLowerCase()
    .trim(),
  password: z
    .string({ required_error: "Password is required" })
    .min(6, { message: "Password must be at least 6 characters" })
    .max(100, { message: "Password must not exceed 100 characters" })
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(
      /[^A-Za-z0-9]/,
      "Password must contain at least one special character"
    ),
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

export const updateProfileSchema = z.object({
  firstName: z
    .string()
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name must not exceed 50 characters")
    .regex(/^[a-zA-Z ]+$/, {
      message: "First name must contain only alphabetic characters",
    })
    .trim()
    .optional(),
  lastName: z
    .string()
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name must not exceed 50 characters")
    .regex(/^[a-zA-Z ]*$/, {
      message: "First name must contain only alphabetic characters",
    })
    .trim()
    .optional(),
  email: z.string().email("Invalid email address").toLowerCase().optional(),
});

export const changePasswordSchema = z
  .object({
    oldPassword: z
      .string({ required_error: "Current password is required" })
      .min(2, "Current password is required")
      .nonempty("Current password is required"),
    newPassword: z
      .string({ required_error: "New password is required" })
      .min(6, "New password must be at least 6 characters")
      .max(100, "New password must not exceed 100 characters")
      .regex(/[A-Z]/, "New password must contain at least one uppercase letter")
      .regex(/[a-z]/, "New password must contain at least one lowercase letter")
      .regex(/[0-9]/, "New password must contain at least one number")
      .regex(
        /[^A-Za-z0-9]/,
        "New password must contain at least one special character"
      ),
    confirmPassword: z
      .string({ required_error: "Confirm password is required" })
      .nonempty("Confirm password is required"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Password do not match",
    path: ["confirmPassword"],
  });

export const deleteAccountSchema = z.object({
  password: z.string().min(6, "Password must be at least 6 characters long"),
});
