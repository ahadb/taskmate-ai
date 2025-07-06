import { Router } from "express";
import {
  getTasks,
  addTask,
  createAITask,
  editTask,
  removeTask,
  getTask,
} from "../controllers/taskController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = Router();

// Apply authentication middleware to all task routes
router.use(authenticateToken);

// Task routes
router.get("/", getTasks);
router.post("/", addTask);
router.post("/ai", createAITask); // New AI task creation endpoint
router.get("/:id", getTask);
router.put("/:id", editTask);
router.delete("/:id", removeTask);

export default router;
