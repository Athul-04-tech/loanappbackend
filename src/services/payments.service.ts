import { RowDataPacket } from "mysql2";
import db from "../config/db";
import { createError } from "../middleware/errorHandler";
import { Payment } from "../models/payment.model";
import { buildPaginationMeta } from "../utils/paginate";

function createTransactionReference() {
  return `TXN${Date.now()}${Math.floor(Math.random() * 100000)}`;
}

export async function createPayment(accountNumber: string, amount: number) {
  const [customers] = await db.query<RowDataPacket[]>(
    "SELECT id FROM customers WHERE account_number = ?",
    [accountNumber]
  );

  if (customers.length === 0) {
    throw createError(400, "Account number does not exist");
  }

  const transactionReference = createTransactionReference();
  const [result] = await db.query<any>(
    "INSERT INTO payments (customer_id, transaction_reference, payment_amount, status) VALUES (?, ?, ?, 'SUCCESS')",
    [customers[0].id, transactionReference, amount]
  );

  const [rows] = await db.query<RowDataPacket[]>(
    "SELECT * FROM payments WHERE id = ?",
    [result.insertId]
  );

  return rows[0] as Payment;
}

export async function listPaymentsByAccountNumber(
  accountNumber: string,
  page: number,
  limit: number,
  offset: number,
  sort: string,
  order: string
) {
  const [customers] = await db.query<RowDataPacket[]>(
    "SELECT id FROM customers WHERE account_number = ?",
    [accountNumber]
  );

  if (customers.length === 0) {
    throw createError(404, "Customer not found");
  }

  const customerId = customers[0].id;
  const [rows] = await db.query<RowDataPacket[]>(
    `SELECT * FROM payments WHERE customer_id = ? ORDER BY ${sort} ${order} LIMIT ? OFFSET ?`,
    [customerId, limit, offset]
  );
  const [countRows] = await db.query<RowDataPacket[]>(
    "SELECT COUNT(*) AS count FROM payments WHERE customer_id = ?",
    [customerId]
  );

  return {
    data: rows as Payment[],
    pagination: buildPaginationMeta(page, limit, Number(countRows[0].count)),
  };
}
