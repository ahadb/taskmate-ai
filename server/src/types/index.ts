import { Request } from "express";

// Database types
export interface User {
  id: string;
  email: string;
  password_hash: string;
  created_at: Date;
}

export interface Task {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  completed: boolean;
  due_date?: Date;
  priority?: "low" | "medium" | "high";
  created_at: Date;
  updated_at: Date;
}

// Request/Response types
export interface CreateTaskRequest {
  title: string;
  description?: string;
  due_date?: string;
  priority?: "low" | "medium" | "high";
}

export interface UpdateTaskRequest {
  title?: string;
  description?: string;
  due_date?: string;
  priority?: "low" | "medium" | "high";
  completed?: boolean;
}

export interface CreateUserRequest {
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
  };
}

// AI Task types
export interface AITaskRequest {
  naturalLanguageInput: string;
}

export interface ParsedTaskData {
  title: string;
  description?: string;
  due_date?: string;
  priority?: "low" | "medium" | "high";
}

// Extended Express Request with user
export interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
    email: string;
  };
}

// Database result types
export interface QueryResult<T> {
  rows: T[];
  rowCount: number;
}

// Error types
export interface AppError extends Error {
  statusCode?: number;
  isOperational?: boolean;
}
