import jwt from "jsonwebtoken";
import { UserRole } from "../models/user.model";

export type JwtPayload = {
  userId: number;
  role: UserRole;
  accountNumber: string | null;
};

function getSecret() {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is required");
  }
  return process.env.JWT_SECRET;
}

export function signToken(payload: JwtPayload) {
  return jwt.sign(payload, getSecret(), { expiresIn: "2h" });
}

export function verifyToken(token: string) {
  return jwt.verify(token, getSecret()) as JwtPayload;
}
