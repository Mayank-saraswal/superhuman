import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().describe("DB URL").default("postgres://postgres:postgres@localhost:5432/postgres"),
});

function createEnv(env: NodeJS.ProcessEnv) {
  // If we are in build time or DATABASE_URL is missing but we're in CI, fallback
  const safeParseResult = envSchema.safeParse(env);
  if (!safeParseResult.success) {
    if (process.env.NODE_ENV === "production" && !process.env.CI) {
      throw new Error(safeParseResult.error.message);
    }
    return { DATABASE_URL: "postgres://postgres:postgres@localhost:5432/postgres" };
  }
  return safeParseResult.data;
}

export const env = createEnv(process.env);
