import { z } from "zod";

const envSchema = z.object({
  INSTANT_APP_ID: z.string().min(1, "INSTANT_APP_ID is required"),
  INSTANT_ADMIN_TOKEN: z.string().min(1, "INSTANT_ADMIN_TOKEN is required"),
  RESEND_API_KEY: z.string().min(1, "RESEND_API_KEY is required"),
  CONTACT_ALERT_RECIPIENT: z
    .string()
    .email("CONTACT_ALERT_RECIPIENT must be a valid email"),
  SUPPORT_FROM_EMAIL: z
    .string()
    .email("SUPPORT_FROM_EMAIL must be a valid email"),
  NEXTAUTH_SECRET: z.string().min(1, "NEXTAUTH_SECRET is required"),
  NEXTAUTH_URL: z.string().optional(),
  PASSWORD_PEPPER: z.string().min(1, "PASSWORD_PEPPER is required"),
  CONTACT_ALLOWED_ORIGIN: z.string().default("*"),
  SITE_BASE_URL: z
    .string()
    .url("SITE_BASE_URL must be a valid URL")
    .default("http://localhost:3000"),
});

type Env = z.infer<typeof envSchema>;

export const env: Env = envSchema.parse({
  INSTANT_APP_ID: process.env.INSTANT_APP_ID,
  INSTANT_ADMIN_TOKEN: process.env.INSTANT_ADMIN_TOKEN,
  RESEND_API_KEY: process.env.RESEND_API_KEY,
  CONTACT_ALERT_RECIPIENT: process.env.CONTACT_ALERT_RECIPIENT,
  SUPPORT_FROM_EMAIL: process.env.SUPPORT_FROM_EMAIL,
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
  NEXTAUTH_URL: process.env.NEXTAUTH_URL,
  PASSWORD_PEPPER: process.env.PASSWORD_PEPPER,
  CONTACT_ALLOWED_ORIGIN: process.env.CONTACT_ALLOWED_ORIGIN,
  SITE_BASE_URL: process.env.SITE_BASE_URL,
});

