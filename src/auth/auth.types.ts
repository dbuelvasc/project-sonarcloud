import type { Request } from "express";

import { User } from "@/user/user";

export type ValidatedUser = Omit<User, "password">;

export interface AuthRequest extends Request {
  user: ValidatedUser;
}

export interface JWTPayload {
  username: string;
  role: string;
  sub: number;
}
