import { query } from "../db/index.js";
import { Task, CreateTaskRequest, UpdateTaskRequest } from "../types/index.js";

export const getTasksByUserId = async (userId: string): Promise<Task[]> => {
  const result = await query<Task>(
    "SELECT * FROM tasks WHERE user_id = $1 ORDER BY created_at DESC",
    [userId]
  );
  return result.rows;
};

export const createTask = async (
  userId: string,
  taskData: CreateTaskRequest
): Promise<Task> => {
  const { title, description, due_date, priority } = taskData;

  const result = await query<Task>(
    `INSERT INTO tasks (user_id, title, description, due_date, priority)
     VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [userId, title, description, due_date, priority]
  );

  if (!result.rows[0]) {
    throw new Error("Failed to create task");
  }
  return result.rows[0];
};

export const updateTask = async (
  userId: string,
  taskId: string,
  taskData: UpdateTaskRequest
): Promise<Task | null> => {
  const { title, description, due_date, priority, completed } = taskData;

  const result = await query<Task>(
    `UPDATE tasks
     SET title = COALESCE($1, title), 
         description = COALESCE($2, description), 
         due_date = COALESCE($3, due_date), 
         priority = COALESCE($4, priority), 
         completed = COALESCE($5, completed)
     WHERE id = $6 AND user_id = $7
     RETURNING *`,
    [title, description, due_date, priority, completed, taskId, userId]
  );

  return result.rows[0] || null;
};

export const deleteTask = async (
  userId: string,
  taskId: string
): Promise<boolean> => {
  const result = await query(
    "DELETE FROM tasks WHERE id = $1 AND user_id = $2",
    [taskId, userId]
  );

  return (result.rowCount ?? 0) > 0;
};

export const getTaskById = async (
  userId: string,
  taskId: string
): Promise<Task | null> => {
  const result = await query<Task>(
    "SELECT * FROM tasks WHERE id = $1 AND user_id = $2",
    [taskId, userId]
  );

  return result.rows[0] || null;
};
