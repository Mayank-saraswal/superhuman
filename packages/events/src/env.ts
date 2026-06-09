import { z } from "zod";
import * as dotenv from "dotenv";

dotenv.config();

const envSchema = z.object({
  INNGEST_EVENT_KEY: z.string().optional(),
});

export const env = envSchema.parse(process.env);
