export type PaymentStatus = "PENDING" | "SUCCESS" | "FAILED";

export type Payment = {
  id: number;
  customer_id: number;
  transaction_reference: string;
  payment_date: Date;
  payment_amount: string;
  status: PaymentStatus;
  created_at: Date;
};
