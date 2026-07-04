# Payment Collection App Backend

Node.js, Express, MySQL, JWT, and bcrypt backend for the Payment Collection App.

## Prerequisites

- Node.js 20+
- npm
- MySQL 8+

## Local Setup

1. Copy `.env.example` to `.env`.
2. Set `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `DB_PORT`, and `JWT_SECRET`.
3. Install dependencies:

```bash
npm install
```

4. Run the migrations in order against your MySQL database:

```bash
mysql -u root -p payment_collection < src/migrations/001_create_customers.sql
mysql -u root -p payment_collection < src/migrations/002_create_payments.sql
mysql -u root -p payment_collection < src/migrations/003_create_users.sql
mysql -u root -p payment_collection < src/migrations/004_add_loan_amount_to_customers.sql
```

5. Start the API:

```bash
npm run dev
```

## API Reference

All responses use `{ success, message, data, pagination, error }`, omitting unused fields.

### Auth

- `POST /api/auth/register`
  Body: `{ "accountNumber": "ACC001", "email": "user@example.com", "password": "password123" }`
- `POST /api/auth/login`
  Body: `{ "email": "user@example.com", "password": "password123" }`
- `GET /api/auth/me`
  Header: `Authorization: Bearer <token>`

### Customers

- `GET /api/customers?page=1&limit=20`
  Roles: `collector`, `admin`
- `GET /api/customers/:accountNumber`
  Roles: any authenticated role. Customers can only access their own account.
  Includes computed balance fields: `loan_amount`, `total_amount_paid`, `remaining_amount`, `is_paid_off`, `is_overpaid`, and `balance_status`.

### Payments

- `POST /api/payments`
  Roles: `customer`, `admin`
  Body: `{ "accountNumber": "ACC001", "amount": 5000 }`
- `GET /api/customers/:accountNumber/payments?page=1&limit=20&sort=payment_date&order=desc`
  Roles: any authenticated role. Customers can only access their own account.

Pagination defaults to `page=1`, `limit=20`, `sort=id`, `order=asc`, with `limit` capped at 100.

## CI/CD Pipeline

A production pipeline should run `npm ci`, build the TypeScript output with `npm run build`, deploy to EC2, run `npm ci --production`, and reload the PM2 process.

Required secrets: `EC2_HOST`, `EC2_SSH_KEY`, `EC2_USER`, `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `DB_PORT`, `JWT_SECRET`, `NODE_ENV`, and `PORT`.

## AWS EC2 Deployment

Deploy on Ubuntu with Node.js, PM2, Nginx, and MySQL or RDS. Nginx should reverse proxy port 80/443 to the Node process on `localhost:3000`. Keep MySQL private unless remote access is required.

## Future Improvements

- Refresh tokens and password reset flow.
- Database transactions around future loan balance updates.
- Structured request/application logging.
- OpenAPI/Swagger documentation.
- Repository layer if the API grows beyond this small endpoint set.
