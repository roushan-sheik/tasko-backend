import { z } from "zod";
const loginValidationSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(6, "Password should be min 6 characters"),
  }),
});

const registerUserValidationSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string(),
  }),
});

export const AuthValidation = {
  loginValidationSchema,
  registerUserValidationSchema,
};
