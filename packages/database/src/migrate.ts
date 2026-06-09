import { migrate } from "drizzle-orm/node-postgres/migrator";
import { db, pool } from "./index";
import * as path from "path";

/**
 * Runs pending Drizzle migrations.
 * Typically invoked as a pre-start step in production.
 */
export async function runMigrations() {
  console.log("Running pending migrations...");
  try {
    await migrate(db, {
      migrationsFolder: path.join(__dirname, "../drizzle/migrations"),
    });
    console.log("Migrations complete!");
  } catch (error) {
    console.error("Failed to run migrations:", error);
    process.exit(1);
  } finally {
    // End the pool so the script can exit if run standalone
    await pool.end();
  }
}

// If this script is run directly, execute the migrations
if (require.main === module) {
  runMigrations();
}
