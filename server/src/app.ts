import express, { Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/auth.js";
import taskRoutes from "./routes/tasks.js";
import realAiTaskRoutes from "./routes/realAiTasks.js";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get("/api/health", (req: Request, res: Response) => {
  res.status(200).json({ message: "API is up and running" });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/ai-tasks", realAiTaskRoutes);

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: Function) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

// 404 handler
app.use("*", (req: Request, res: Response) => {
  res.status(404).json({ message: "Route not found" });
});

const PORT = process.env["PORT"] || 8080;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
