import { NextFunction, Request, Response } from "express";

export type AppError = Error & { status?: number };

export function errorHandler(error: AppError, _req: Request, res: Response, _next: NextFunction) {
  console.error(error);

  const status = error.status || 500;
  res.status(status).json({
    success: false,
    error: status === 500 ? "Server error" : error.message,
  });
}

export function createError(status: number, message: string) {
  const error = new Error(message) as AppError;
  error.status = status;
  return error;
}
