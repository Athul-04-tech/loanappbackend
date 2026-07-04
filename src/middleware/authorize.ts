import { NextFunction, Request, Response } from "express";
import { UserRole } from "../models/user.model";

export function authorize(roles: UserRole[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ success: false, error: "Forbidden" });
    }

    next();
  };
}
