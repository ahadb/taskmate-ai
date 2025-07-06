import { seedUsers } from "./users.ts";
import { seedTasks } from "./tasks.ts";
import { cleanupDatabase } from "./cleanup.ts";

export const runSeeds = async () => {
  try {
    console.log("🌱 Starting database seeding...");

    // Clean up existing data first
    await cleanupDatabase();

    // Run seeds in order
    await seedUsers();
    await seedTasks();

    console.log("✅ Database seeding completed successfully!");
  } catch (error) {
    console.error("❌ Error during seeding:", error);
    throw error;
  }
};

export const cleanupSeeds = async () => {
  try {
    console.log("🧹 Starting database cleanup...");
    await cleanupDatabase();
    console.log("✅ Database cleanup completed successfully!");
  } catch (error) {
    console.error("❌ Error during cleanup:", error);
    throw error;
  }
};

// Run seeds if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runSeeds()
    .then(() => {
      console.log("🎉 Seeding finished!");
      process.exit(0);
    })
    .catch((error) => {
      console.error("💥 Seeding failed:", error);
      process.exit(1);
    });
}
