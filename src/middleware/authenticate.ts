import { NextFunction, Request, Response } from "express";
import { verifyToken } from "../utils/jwt";
import { UserRole } from "../models/user.model";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        role: UserRole;
        accountNumber: string | null;
      };
    }
  }
}

export function authenticate(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ success: false, error: "Missing token" });
  }

  try {
    const payload = verifyToken(header.slice(7));
    req.user = {
      id: payload.userId,
      role: payload.role,
      accountNumber: payload.accountNumber,
    };
    next();
  } catch {
    res.status(401).json({ success: false, error: "Invalid token" });
  }
}
