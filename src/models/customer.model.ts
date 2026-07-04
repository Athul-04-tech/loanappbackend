export type Customer = {
  id: number;
  account_number: string;
  issue_date: Date;
  interest_rate: string;
  tenure_months: number;
  loan_amount: string;
  emi_due: string;
  total_amount_paid?: string;
  remaining_amount?: string;
  is_paid_off?: boolean;
  is_overpaid?: boolean;
  balance_status?: "ACTIVE" | "PAID_OFF" | "OVERPAID";
  created_at: Date;
  updated_at: Date;
};
