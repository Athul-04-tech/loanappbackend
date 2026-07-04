CREATE TABLE payments (
  id INT PRIMARY KEY AUTO_INCREMENT,
  customer_id INT NOT NULL,
  transaction_reference VARCHAR(40) NOT NULL UNIQUE,
  payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  payment_amount DECIMAL(10,2) NOT NULL,
  status ENUM('PENDING','SUCCESS','FAILED') NOT NULL DEFAULT 'PENDING',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (customer_id) REFERENCES customers(id),
  INDEX idx_customer_id (customer_id),
  INDEX idx_customer_payment_date (customer_id, payment_date)
);
