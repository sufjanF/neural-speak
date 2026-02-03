/**
 * Environment variable validation using T3 Env and Zod.
 * Ensures type-safe access to environment variables at build time.
 * @see https://env.t3.gg/docs/nextjs
 */
import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  // Server-side environment variables (not exposed to client)
  server: {
    DATABASE_URL: z.url(),
    BETTER_AUTH_SECRET: z.string(),
    BETTER_AUTH_URL: z.url(),
    POLAR_ACCESS_TOKEN: z.string(),
    POLAR_WEBHOOK_SECRET: z.string(),
    AWS_ACCESS_KEY_ID: z.string().optional(),
    AWS_SECRET_ACCESS_KEY: z.string().optional(),
    AWS_REGION: z.string().optional(),
    AWS_S3_BUCKET_NAME: z.string().optional(),
    MODAL_API_URL: z.url(),
    MODAL_API_KEY: z.string(),
    MODAL_API_SECRET: z.string(),
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),
  },

  // Client-side variables (must be prefixed with NEXT_PUBLIC_)
  client: {
    // NEXT_PUBLIC_CLIENTVAR: z.string(),
  },

  // Runtime mapping (required for Edge runtimes)
  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    NODE_ENV: process.env.NODE_ENV,
    BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
    BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,
    POLAR_ACCESS_TOKEN: process.env.POLAR_ACCESS_TOKEN,
    POLAR_WEBHOOK_SECRET: process.env.POLAR_WEBHOOK_SECRET,
    AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
    AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
    AWS_REGION: process.env.AWS_REGION,
    AWS_S3_BUCKET_NAME: process.env.AWS_S3_BUCKET_NAME,
    MODAL_API_URL: process.env.MODAL_API_URL,
    MODAL_API_KEY: process.env.MODAL_API_KEY,
    MODAL_API_SECRET: process.env.MODAL_API_SECRET,
  },

  // Skip validation for Docker builds
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  
  // Treat empty strings as undefined
  emptyStringAsUndefined: true,
});