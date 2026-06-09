import { z } from "zod";
import * as dotenv from "dotenv";

dotenv.config();

const envSchema = z.object({
  OPENAI_API_KEY: z.string().min(1, "OPENAI_API_KEY is required"),
});

/**
 * Validated environment variables for the AI package.
 */
export const env = envSchema.parse(process.env);
