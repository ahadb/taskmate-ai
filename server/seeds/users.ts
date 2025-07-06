import { query } from "../src/db/index.ts";
import bcrypt from "bcrypt";

export interface SeedUser {
  email: string;
  password: string;
  name: string;
}

const sampleUsers: SeedUser[] = [
  {
    email: "john@example.com",
    password: "password123",
    name: "John Doe",
  },
  {
    email: "jane@example.com",
    password: "password123",
    name: "Jane Smith",
  },
  {
    email: "demo@example.com",
    password: "demo123",
    name: "Demo User",
  },
];

export const seedUsers = async () => {
  try {
    console.log("👥 Seeding users...");

    for (const user of sampleUsers) {
      const hashedPassword = await bcrypt.hash(user.password, 10);

      await query(
        "INSERT INTO users (email, password_hash) VALUES ($1, $2) ON CONFLICT (email) DO NOTHING",
        [user.email, hashedPassword]
      );
    }

    console.log(`✅ Seeded ${sampleUsers.length} users`);
  } catch (error) {
    console.error("❌ Error seeding users:", error);
    throw error;
  }
};

export const deleteUsers = async () => {
  try {
    console.log("🗑️ Deleting all users...");
    await query("DELETE FROM users");
    console.log("✅ All users deleted");
  } catch (error) {
    console.error("❌ Error deleting users:", error);
    throw error;
  }
};
