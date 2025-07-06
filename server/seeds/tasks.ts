import { query } from "../src/db/index.ts";

export interface SeedTask {
  user_id: string;
  title: string;
  description?: string;
  due_date?: string;
  priority?: "low" | "medium" | "high";
  completed: boolean;
}

const sampleTasks: Omit<SeedTask, "user_id">[] = [
  {
    title: "Complete project proposal",
    description: "Write and submit the quarterly project proposal for Q1",
    due_date: "2024-12-25",
    priority: "high",
    completed: false,
  },
  {
    title: "Review team performance",
    description: "Conduct monthly 1-on-1 meetings with team members",
    due_date: "2024-12-28",
    priority: "medium",
    completed: false,
  },
  {
    title: "Update documentation",
    description: "Update API documentation and user guides",
    due_date: "2024-12-30",
    priority: "low",
    completed: true,
  },
  {
    title: "Schedule client meeting",
    description: "Coordinate with client for next week's presentation",
    due_date: "2024-12-22",
    priority: "high",
    completed: false,
  },
  {
    title: "Backup database",
    description: "Create weekly database backup and verify integrity",
    due_date: "2024-12-24",
    priority: "medium",
    completed: false,
  },
  {
    title: "Learn new framework",
    description: "Study React 18 features and best practices",
    priority: "low",
    completed: false,
  },
  {
    title: "Plan team lunch",
    description: "Organize monthly team building lunch event",
    due_date: "2024-12-29",
    priority: "low",
    completed: false,
  },
  {
    title: "Fix critical bug",
    description: "Resolve authentication issue in production",
    due_date: "2024-12-21",
    priority: "high",
    completed: true,
  },
];

export const seedTasks = async () => {
  try {
    console.log("📋 Seeding tasks...");

    // Get the first user to assign tasks to
    const userResult = await query("SELECT id FROM users LIMIT 1");
    if (userResult.rows.length === 0) {
      throw new Error("No users found. Please seed users first.");
    }

    const userId = userResult.rows[0].id;

    for (const task of sampleTasks) {
      await query(
        `INSERT INTO tasks (user_id, title, description, due_date, priority, completed) 
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [
          userId,
          task.title,
          task.description,
          task.due_date,
          task.priority,
          task.completed,
        ]
      );
    }

    console.log(`✅ Seeded ${sampleTasks.length} tasks`);
  } catch (error) {
    console.error("❌ Error seeding tasks:", error);
    throw error;
  }
};

export const deleteTasks = async () => {
  try {
    console.log("🗑️ Deleting all tasks...");
    await query("DELETE FROM tasks");
    console.log("✅ All tasks deleted");
  } catch (error) {
    console.error("❌ Error deleting tasks:", error);
    throw error;
  }
};
