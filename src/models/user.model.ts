export type UserRole = "customer" | "collector" | "admin";

export type User = {
  id: number;
  account_number: string | null;
  email: string;
  password_hash: string;
  role: UserRole;
  created_at: Date;
  updated_at: Date;
};

export type PublicUser = {
  id: number;
  accountNumber: string | null;
  email: string;
  role: UserRole;
};
