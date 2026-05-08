import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { env } from "@/lib/env";

// One-shot endpoint to create the Auth.js tables on the prod DB.
// Protected by AUTH_SECRET. Remove this route after first successful run.
export async function POST(req: Request) {
  const secret = req.headers.get("x-init-secret");
  if (!secret || secret !== env.AUTH_SECRET) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const sql = [
    `CREATE TABLE IF NOT EXISTS "users" (
      "id" TEXT PRIMARY KEY,
      "name" TEXT,
      "email" TEXT UNIQUE,
      "email_verified" TIMESTAMP(3),
      "image" TEXT
    )`,
    `CREATE TABLE IF NOT EXISTS "accounts" (
      "id" TEXT PRIMARY KEY,
      "user_id" TEXT NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
      "type" TEXT NOT NULL,
      "provider" TEXT NOT NULL,
      "provider_account_id" TEXT NOT NULL,
      "refresh_token" TEXT,
      "access_token" TEXT,
      "expires_at" INTEGER,
      "token_type" TEXT,
      "scope" TEXT,
      "id_token" TEXT,
      "session_state" TEXT,
      UNIQUE("provider", "provider_account_id")
    )`,
    `CREATE TABLE IF NOT EXISTS "sessions" (
      "id" TEXT PRIMARY KEY,
      "session_token" TEXT UNIQUE NOT NULL,
      "user_id" TEXT NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
      "expires" TIMESTAMP(3) NOT NULL
    )`,
    `CREATE TABLE IF NOT EXISTS "verification_tokens" (
      "identifier" TEXT NOT NULL,
      "token" TEXT NOT NULL,
      "expires" TIMESTAMP(3) NOT NULL,
      UNIQUE("identifier", "token")
    )`,
  ];

  const results: string[] = [];
  for (const stmt of sql) {
    try {
      await prisma.$executeRawUnsafe(stmt);
      results.push("ok");
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      results.push(`error: ${msg}`);
    }
  }

  return NextResponse.json({ results });
}
