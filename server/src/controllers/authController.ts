import bcrypt from "bcrypt";
import { Request, Response } from "express";
import { createUser, getUserByEmail } from "../models/userModel.js";
import { generateToken } from "../middleware/authMiddleware.js";
import {
  CreateUserRequest,
  LoginRequest,
  AuthResponse,
} from "../types/index.js";

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password }: CreateUserRequest = req.body;

    // Check if user already exists
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      res.status(400).json({ message: "User already exists" });
      return;
    }

    // Create new user
    const newUser = await createUser({ email, password });

    // Generate token
    const token = generateToken(newUser.id, newUser.email);

    const response: AuthResponse = {
      token,
      user: {
        id: newUser.id,
        email: newUser.email,
      },
    };

    res.status(201).json(response);
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password }: LoginRequest = req.body;

    // Find user by email
    const user = await getUserByEmail(email);
    if (!user) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    // Generate token
    const token = generateToken(user.id, user.email);

    const response: AuthResponse = {
      token,
      user: {
        id: user.id,
        email: user.email,
      },
    };

    res.json(response);
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
