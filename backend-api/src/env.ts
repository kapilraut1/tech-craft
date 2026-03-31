import { z } from "zod";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env") });

const envSchema = z.object({
  PORT: z.string().default("5000").transform(Number),
  DB_HOST: z.string(),
  DB_USERNAME: z.string(),
  DB_PASSWORD: z.string(),
  DB_PORT: z.string().regex(/^\d+$/).default("3306").transform(Number),
  DB_NAME: z.string(),
  NODE_ENV: z.string().default("development"),
  JWT_SECRET: z.string(),
  FRONTEND_URL: z.string(),
});

const envData = envSchema.safeParse(process.env);

if (!envData.success) {
  console.error("Invalid environment variables:", envData.error.format());
  process.exit(1);
}

export const env = envData.data;
