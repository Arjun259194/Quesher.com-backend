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

export type UserLoginRequestBody = z.infer<typeof userLoginRequestBody>;

export type UserRegisterRequestBody = z.infer<typeof userRegisterRequestBody>;
