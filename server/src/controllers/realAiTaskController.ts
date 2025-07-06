import { Response } from "express";
import { createTask } from "../models/taskModel.js";
import { AuthenticatedRequest } from "../types/index.js";
import {
  parseTaskWithAI,
  enhanceTaskWithAI,
  suggestTaskImprovements,
} from "../services/realAiTaskService.js";

export const createRealAITask = async (
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

    // Parse natural language input using real AI
    const parsedTask = await parseTaskWithAI(naturalLanguageInput);

    // Return the parsed task data (don't create the task here)
    res.status(200).json(parsedTask);
  } catch (error) {
    console.error("Error creating AI task:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const enhanceTask = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: "User not authenticated" });
      return;
    }

    const taskData = req.body;

    if (!taskData || !taskData.title) {
      res.status(400).json({ message: "Task data with title is required" });
      return;
    }

    // Enhance task using AI
    const enhancedTask = await enhanceTaskWithAI(taskData);
    res.json(enhancedTask);
  } catch (error) {
    console.error("Error enhancing task:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getTaskSuggestions = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: "User not authenticated" });
      return;
    }

    const taskData = req.body;

    if (!taskData || !taskData.title) {
      res.status(400).json({ message: "Task data with title is required" });
      return;
    }

    // Get AI suggestions for task improvements
    const suggestions = await suggestTaskImprovements(taskData);
    res.json({ suggestions });
  } catch (error) {
    console.error("Error getting task suggestions:", error);
    res.status(500).json({ message: "Server error" });
  }
};
