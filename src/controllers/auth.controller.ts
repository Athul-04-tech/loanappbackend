import { NextFunction, Request, Response } from "express";
import * as authService from "../services/auth.service";

export async function register(req: Request, res: Response, next: NextFunction) {
  try {
    const { accountNumber, email, password } = req.body;
    const data = await authService.register(accountNumber, email, password);
    res.status(201).json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password } = req.body;
    const data = await authService.login(email, password);
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

export async function me(req: Request, res: Response, next: NextFunction) {
  try {
    const user = await authService.getMe(req.user!.id);
    res.json({ success: true, data: { user } });
  } catch (error) {
    next(error);
  }
}
