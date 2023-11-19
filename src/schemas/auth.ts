import { z } from "zod";

export const userRegisterRequestBody = z.object({
  username: z.string(),
  email: z.string().email(),
  password: z.string(),
});

export const userLoginRequestBody = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const otpQuery = z.object({
  email: z.string().email(),
  code: z.number().min(6).max(6).int(),
});

export type UserLoginRequestBody = z.infer<typeof userLoginRequestBody>;

export type UserRegisterRequestBody = z.infer<typeof userRegisterRequestBody>;

export type OTPQuery = z.infer<typeof otpQuery>;
