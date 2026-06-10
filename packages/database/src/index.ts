import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { env } from "./env";
import * as schema from "./schema";

/**
 * The standard pg Pool configured with our environment database URL.
 */
export const pool = new Pool({
  connectionString: env.DATABASE_URL,
});

/**
 * The Drizzle ORM instance configured with our merged schema.
 */
export const db = drizzle(pool, { schema });

// Re-export all schema exports so consumers can import them cleanly
export * from "./schema";

// Re-export standard Drizzle operators for query building
export { eq, and, or, desc, asc, inArray, isNull, sql, ilike } from "drizzle-orm";
