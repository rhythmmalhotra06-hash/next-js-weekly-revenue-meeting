// Validates required environment variables at module-load time.
// Process exits with a clear error list if any required var is missing.

import { z } from "zod";

const RequiredString = z.string().min(1, { message: "required" });

const EnvSchema = z.object({
  // Database — Prisma + Postgres for NextAuth session tables.
  DATABASE_URL: RequiredString,

  // Auth.js (NextAuth v5).
  AUTH_SECRET: RequiredString,
  GOOGLE_CLIENT_ID: RequiredString,
  GOOGLE_CLIENT_SECRET: RequiredString,
  AUTH_TRUST_HOST: z
    .string()
    .optional()
    .transform((v) => {
      if (!v) return false;
      const s = v.trim().toLowerCase();
      return s === "true" || s === "1" || s === "yes";
    }),

  // Domain restriction for Google SSO.
  AUTH_ALLOWED_EMAIL_DOMAIN: RequiredString.default("mindvalley.com"),

  // Dev-only mock session — bypasses Google OAuth for local testing.
  // IGNORED in production.
  MOCK_SESSION_EMAIL: z.string().optional(),

  // Set automatically by Next.js.
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),

  // Airtable — primary data source.
  AIRTABLE_API_KEY: RequiredString,
  AIRTABLE_BASE_ID: RequiredString,
});

const parsed = EnvSchema.safeParse(process.env);

if (!parsed.success) {
  const issues = parsed.error.issues
    .map((i) => `  - ${i.path.join(".")}: ${i.message}`)
    .join("\n");
  console.error(
    `\n[mv-revenue-meeting] env vars missing or invalid:\n${issues}\n\nSee .env.local.example for the full list.\n`
  );
  // Don't exit during the production build phase — Next.js collects page shapes
  // without running request handlers and env vars may not be set then.
  if (process.env.NEXT_PHASE !== "phase-production-build") {
    process.exit(1);
  }
}

export const env = (parsed.data ?? {}) as ReturnType<typeof EnvSchema.parse>;
