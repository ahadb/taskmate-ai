import { query } from "../src/db/index.ts";

export const cleanupDatabase = async () => {
  try {
    console.log("🧹 Cleaning up existing data...");

    // Delete in reverse order of dependencies
    await query("DELETE FROM tasks");
    await query("DELETE FROM users");

    console.log("✅ Database cleanup completed");
  } catch (error) {
    console.error("❌ Error during cleanup:", error);
    throw error;
  }
};
