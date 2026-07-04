import { NextFunction, Request, Response } from "express";
import { createError } from "../middleware/errorHandler";
import * as paymentsService from "../services/payments.service";
import { buildPagination } from "../utils/paginate";

export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    const { accountNumber, amount } = req.body;

    if (req.user?.role === "customer" && req.user.accountNumber !== accountNumber) {
      throw createError(403, "Forbidden");
    }

    const payment = await paymentsService.createPayment(accountNumber, amount);
    res.status(201).json({
      success: true,
      message: "Payment submitted successfully",
      data: payment,
    });
  } catch (error) {
    next(error);
  }
}

export async function listByCustomer(req: Request, res: Response, next: NextFunction) {
  try {
    const { accountNumber } = req.params;

    if (req.user?.role === "customer" && req.user.accountNumber !== accountNumber) {
      throw createError(403, "Forbidden");
    }

    const { page, limit, offset, sort, order } = buildPagination(req.query, [
      "payment_date",
      "payment_amount",
      "id",
    ]);
    const result = await paymentsService.listPaymentsByAccountNumber(
      accountNumber,
      page,
      limit,
      offset,
      sort,
      order
    );

    res.json({ success: true, data: result.data, pagination: result.pagination });
  } catch (error) {
    next(error);
  }
}
