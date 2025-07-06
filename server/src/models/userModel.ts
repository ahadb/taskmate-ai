import bcrypt from "bcrypt";
import { query } from "../db/index.js";
import { User, CreateUserRequest } from "../types/index.js";

export const createUser = async (
  userData: CreateUserRequest
): Promise<User> => {
  const { email, password } = userData;
  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  const result = await query<User>(
    "INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING *",
    [email, passwordHash]
  );

  if (!result.rows[0]) {
    throw new Error("Failed to create user");
  }
  return result.rows[0];
};

export const getUserByEmail = async (email: string): Promise<User | null> => {
  const result = await query<User>("SELECT * FROM users WHERE email = $1", [
    email,
  ]);

  return result.rows[0] || null;
};

export const getUserById = async (id: string): Promise<User | null> => {
  const result = await query<User>("SELECT * FROM users WHERE id = $1", [id]);

  return result.rows[0] || null;
};
