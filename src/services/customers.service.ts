import { RowDataPacket } from "mysql2";
import db from "../config/db";
import { createError } from "../middleware/errorHandler";
import { Customer } from "../models/customer.model";
import { buildPaginationMeta } from "../utils/paginate";

const customerBalanceSelect = `
  SELECT
    c.*,
    COALESCE(SUM(CASE WHEN p.status = 'SUCCESS' THEN p.payment_amount ELSE 0 END), 0) AS total_amount_paid,
    GREATEST(c.loan_amount - COALESCE(SUM(CASE WHEN p.status = 'SUCCESS' THEN p.payment_amount ELSE 0 END), 0), 0) AS remaining_amount,
    COALESCE(SUM(CASE WHEN p.status = 'SUCCESS' THEN p.payment_amount ELSE 0 END), 0) >= c.loan_amount AS is_paid_off,
    COALESCE(SUM(CASE WHEN p.status = 'SUCCESS' THEN p.payment_amount ELSE 0 END), 0) > c.loan_amount AS is_overpaid,
    CASE
      WHEN COALESCE(SUM(CASE WHEN p.status = 'SUCCESS' THEN p.payment_amount ELSE 0 END), 0) > c.loan_amount THEN 'OVERPAID'
      WHEN COALESCE(SUM(CASE WHEN p.status = 'SUCCESS' THEN p.payment_amount ELSE 0 END), 0) >= c.loan_amount THEN 'PAID_OFF'
      ELSE 'ACTIVE'
    END AS balance_status
  FROM customers c
  LEFT JOIN payments p ON p.customer_id = c.id
`;

export async function listCustomers(page: number, limit: number, offset: number, sort: string, order: string) {
  const [rows] = await db.query<RowDataPacket[]>(
    `${customerBalanceSelect} GROUP BY c.id ORDER BY c.${sort} ${order} LIMIT ? OFFSET ?`,
    [limit, offset]
  );
  const [countRows] = await db.query<RowDataPacket[]>("SELECT COUNT(*) AS count FROM customers");

  return {
    data: rows as Customer[],
    pagination: buildPaginationMeta(page, limit, Number(countRows[0].count)),
  };
}

export async function getCustomerByAccountNumber(accountNumber: string) {
  const [rows] = await db.query<RowDataPacket[]>(
    `${customerBalanceSelect} WHERE c.account_number = ? GROUP BY c.id`,
    [accountNumber]
  );

  if (rows.length === 0) {
    throw createError(404, "Customer not found");
  }

  return rows[0] as Customer;
}
