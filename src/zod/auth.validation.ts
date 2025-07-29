import { z } from "zod";

const loginValidationSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(6, "Password should be min 6 characters"),
  }),
});

const registerUserValidationSchema = z.object({
  body: z.object({
    fullName: z.string().min(3, "Name should be min 3 characters"),
    email: z.string().email(),
    password: z.string(),
  }),
});

const resetPasswordValidationSchema = z.object({
  body: z.object({
    newPassword: z.string().min(6, "Password must be at least 6 characters"),
  }),
});

export const AuthValidation = {
  loginValidationSchema,
  registerUserValidationSchema,
  resetPasswordValidationSchema,
};
