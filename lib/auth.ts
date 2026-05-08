import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import { env } from "@/lib/env";
import { isActiveOktaEmployee } from "@/lib/airtable";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  // Cloud Run / Kessel sit behind a reverse proxy that sets X-Forwarded-Host.
  // Auth.js's default Vercel-only auto-trust is wrong here.
  trustHost: true,
  // JWT sessions: cookie-only, no per-request DB read. The adapter is still
  // used for OAuth account linking on first login (users + accounts tables).
  session: { strategy: "jwt" },
  providers: [
    Google({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
      // Force account chooser so users can switch Google accounts mid-session.
      authorization: { params: { prompt: "select_account" } },
    }),
  ],
  pages: {
    signIn: "/sign-in",
    error: "/sign-in",
  },
  callbacks: {
    // Gate sign-in to currently-employed Mindvalley staff.
    // Domain check first (cheap), then live OKTA Employee Sync lookup.
    // Fails closed on Airtable errors — better to lock out a real user during
    // an outage than admit an ex-employee.
    async signIn({ profile }) {
      const email = profile?.email?.toLowerCase();
      if (!email) return false;
      if (!email.endsWith(`@${env.AUTH_ALLOWED_EMAIL_DOMAIN}`)) return false;
      try {
        return await isActiveOktaEmployee(email);
      } catch (err) {
        console.error("[auth] OKTA allowlist lookup failed", err);
        return false;
      }
    },
  },
});
