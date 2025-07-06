import jwt from "jsonwebtoken";
import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../types/index.js";

const JWT_SECRET = process.env["JWT_SECRET"] || "your-secret-key";

export const authenticateToken = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

  if (!token) {
    res.status(401).json({ message: "Access token required" });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as {
      userId: string;
      email: string;
    };
    req.user = decoded;
    next();
  } catch (error) {
    res.status(403).json({ message: "Invalid token" });
  }
};

export const generateToken = (userId: string, email: string): string => {
  return jwt.sign({ userId, email }, JWT_SECRET, { expiresIn: "24h" });
};
