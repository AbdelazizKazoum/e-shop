// lib/env.ts

import { z } from "zod";

// Define the schema for your environment variables
const envSchema = z.object({
  GOOGLE_CLIENT_ID: z.string().min(1),
  GOOGLE_CLIENT_SECRET: z.string().min(1),
  FACEBOOK_CLIENT_ID: z.string().min(1),
  FACEBOOK_CLIENT_SECRET: z.string().min(1),
  NEXTAUTH_SECRET: z.string().min(1),
  API_URL: z.string().url(), // Example of more specific validation
});

// Parse and export the validated environment variables
export const env = envSchema.parse(process.env);
