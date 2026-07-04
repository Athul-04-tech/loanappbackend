ALTER TABLE customers
  ADD COLUMN loan_amount DECIMAL(10,2) NULL AFTER tenure_months;

UPDATE customers
SET loan_amount = emi_due * tenure_months
WHERE loan_amount IS NULL;

ALTER TABLE customers
  MODIFY loan_amount DECIMAL(10,2) NOT NULL;
