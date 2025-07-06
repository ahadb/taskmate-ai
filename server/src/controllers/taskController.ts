import { Response } from "express";
import {
  getTasksByUserId,
  createTask,
  updateTask,
  deleteTask,
  getTaskById,
} from "../models/taskModel.js";
import {
  AuthenticatedRequest,
  CreateTaskRequest,
  UpdateTaskRequest,
} from "../types/index.js";
import { parseNaturalLanguageTask } from "../services/aiTaskService.js";

export const getTasks = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: "User not authenticated" });
      return;
    }

    const tasks = await getTasksByUserId(req.user.userId);
    res.json(tasks);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const addTask = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: "User not authenticated" });
      return;
    }

    const taskData: CreateTaskRequest = req.body;
    console.log("this is the task data", taskData);
    const newTask = await createTask(req.user.userId, taskData);
    res.status(201).json(newTask);
  } catch (error) {
    console.error("Error creating task:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const createAITask = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: "User not authenticated" });
      return;
    }

    const { naturalLanguageInput } = req.body;

    if (!naturalLanguageInput || typeof naturalLanguageInput !== "string") {
      res.status(400).json({ message: "Natural language input is required" });
      return;
    }

    // Parse natural language input
    const parsedTask = parseNaturalLanguageTask(naturalLanguageInput);

    // Create task with parsed data
    const newTask = await createTask(req.user.userId, parsedTask);
    res.status(201).json(newTask);
  } catch (error) {
    console.error("Error creating AI task:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const editTask = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: "User not authenticated" });
      return;
    }

    const taskId = req.params["id"];
    const taskData: UpdateTaskRequest = req.body;

    const updatedTask = await updateTask(
      req.user.userId,
      taskId as string,
      taskData
    );

    if (!updatedTask) {
      res.status(404).json({ message: "Task not found or unauthorized" });
      return;
    }

    res.json(updatedTask);
  } catch (error) {
    console.error("Error updating task:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const removeTask = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: "User not authenticated" });
      return;
    }

    const taskId = req.params["id"];
    const deleted = await deleteTask(req.user.userId, taskId as string);

    if (!deleted) {
      res.status(404).json({ message: "Task not found or unauthorized" });
      return;
    }

    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error("Error deleting task:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getTask = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: "User not authenticated" });
      return;
    }

    const taskId = req.params["id"];
    const task = await getTaskById(req.user.userId, taskId as string);

    if (!task) {
      res.status(404).json({ message: "Task not found or unauthorized" });
      return;
    }

    res.json(task);
  } catch (error) {
    console.error("Error fetching task:", error);
    res.status(500).json({ message: "Server error" });
  }
};
