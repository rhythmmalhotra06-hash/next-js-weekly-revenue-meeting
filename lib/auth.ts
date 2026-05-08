import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import { env } from "@/lib/env";

// Sentinel log to confirm the deployed image contains this commit.
// If this line is missing from Cloud Run boot logs, the rollout served stale code.
console.log("[auth] init: trustHost=true allowedDomain=" + env.AUTH_ALLOWED_EMAIL_DOMAIN);

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  // Always trust forwarded host on this deploy. Cloud Run / Kessel sit behind
  // a trusted reverse proxy that sets X-Forwarded-Host correctly. We never deploy
  // to Vercel, so Auth.js's default Vercel-only auto-trust is wrong here.
  trustHost: true,
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
    // Domain restriction — reject non-Mindvalley accounts before session creation.
    async signIn({ profile }) {
      const email = profile?.email?.toLowerCase();
      if (!email) return false;
      return email.endsWith(`@${env.AUTH_ALLOWED_EMAIL_DOMAIN}`);
    },
  },
});
