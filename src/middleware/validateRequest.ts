import { NextFunction, Request, Response } from "express";
import { z } from "zod";

export const registerSchema = z.object({
  accountNumber: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(8),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const paymentSchema = z.object({
  accountNumber: z.string().min(1),
  amount: z.number().positive(),
});

export function validateRequest(schema: z.ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        error: result.error.errors[0]?.message || "Validation error",
      });
    }

    req.body = result.data;
    next();
  };
}
