#!/usr/bin/env tsx

import { runSeeds, cleanupSeeds } from "../seeds/index.js";

const command = process.argv[2];

async function main() {
  try {
    switch (command) {
      case "cleanup":
        await cleanupSeeds();
        break;
      case "seed":
      default:
        await runSeeds();
        break;
    }
  } catch (error) {
    console.error("💥 Script failed:", error);
    process.exit(1);
  }
}

main();
