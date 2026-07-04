import { NextFunction, Request, Response } from "express";
import { createError } from "../middleware/errorHandler";
import * as customersService from "../services/customers.service";
import { buildPagination } from "../utils/paginate";

export async function list(req: Request, res: Response, next: NextFunction) {
  try {
    const { page, limit, offset, sort, order } = buildPagination(req.query, ["id", "account_number"]);
    const result = await customersService.listCustomers(page, limit, offset, sort, order);
    res.json({ success: true, data: result.data, pagination: result.pagination });
  } catch (error) {
    next(error);
  }
}

export async function getOne(req: Request, res: Response, next: NextFunction) {
  try {
    const { accountNumber } = req.params;

    if (req.user?.role === "customer" && req.user.accountNumber !== accountNumber) {
      throw createError(403, "Forbidden");
    }

    const customer = await customersService.getCustomerByAccountNumber(accountNumber);
    res.json({ success: true, data: customer });
  } catch (error) {
    next(error);
  }
}
