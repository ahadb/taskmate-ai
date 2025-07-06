import { Router } from "express";
import {
  createRealAITask,
  enhanceTask,
  getTaskSuggestions,
} from "../controllers/realAiTaskController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = Router();

// Apply authentication middleware to all AI task routes
router.use(authenticateToken);

// Real AI task routes
router.post("/create", createRealAITask); // Create task with real AI parsing
router.post("/enhance", enhanceTask); // Enhance existing task with AI
router.post("/suggestions", getTaskSuggestions); // Get AI suggestions for task improvements

export default router;
