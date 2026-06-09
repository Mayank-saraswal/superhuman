import { z } from "zod";
import * as dotenv from "dotenv";

// Load environment variables from .env file if present
dotenv.config();

const envSchema = z.object({
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
  CORSAIR_KEK: z.string().min(32, "CORSAIR_KEK is required and must be at least 32 characters long"),
});

export const env = envSchema.parse(process.env);
