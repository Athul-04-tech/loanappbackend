import { RowDataPacket } from "mysql2";
import db from "../config/db";
import { createError } from "../middleware/errorHandler";
import { PublicUser, User } from "../models/user.model";
import { signToken } from "../utils/jwt";
import { comparePassword, hashPassword } from "../utils/password";

function toPublicUser(user: User): PublicUser {
  return {
    id: user.id,
    accountNumber: user.account_number,
    email: user.email,
    role: user.role,
  };
}

export async function register(accountNumber: string, email: string, password: string) {
  const [customers] = await db.query<RowDataPacket[]>(
    "SELECT id FROM customers WHERE account_number = ?",
    [accountNumber]
  );

  if (customers.length === 0) {
    throw createError(400, "Account number does not exist");
  }

  const [existingUsers] = await db.query<RowDataPacket[]>(
    "SELECT id FROM users WHERE email = ?",
    [email]
  );

  if (existingUsers.length > 0) {
    throw createError(400, "Email is already registered");
  }

  const passwordHash = await hashPassword(password);
  const [result] = await db.query<any>(
    "INSERT INTO users (account_number, email, password_hash, role) VALUES (?, ?, ?, 'customer')",
    [accountNumber, email, passwordHash]
  );

  const user: PublicUser = {
    id: result.insertId,
    accountNumber,
    email,
    role: "customer",
  };
  const token = signToken({ userId: user.id, role: user.role, accountNumber });

  return { user, token };
}

export async function login(email: string, password: string) {
  const [rows] = await db.query<RowDataPacket[]>(
    "SELECT * FROM users WHERE email = ?",
    [email]
  );

  if (rows.length === 0) {
    throw createError(401, "Invalid email or password");
  }

  const user = rows[0] as User;
  const passwordMatches = await comparePassword(password, user.password_hash);

  if (!passwordMatches) {
    throw createError(401, "Invalid email or password");
  }

  const publicUser = toPublicUser(user);
  const token = signToken({
    userId: user.id,
    role: user.role,
    accountNumber: user.account_number,
  });

  return { user: publicUser, token };
}

export async function getMe(userId: number) {
  const [rows] = await db.query<RowDataPacket[]>(
    "SELECT id, account_number, email, role FROM users WHERE id = ?",
    [userId]
  );

  if (rows.length === 0) {
    throw createError(404, "User not found");
  }

  const user = rows[0] as Pick<User, "id" | "account_number" | "email" | "role">;
  return {
    id: user.id,
    accountNumber: user.account_number,
    email: user.email,
    role: user.role,
  };
}
