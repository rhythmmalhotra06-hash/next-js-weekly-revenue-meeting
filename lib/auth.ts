import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import { env } from "@/lib/env";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  // Trust X-Forwarded-Host on non-Vercel deploys (Cloud Run, Railway, Kessel).
  // Driven by AUTH_TRUST_HOST env var, parsed to boolean in lib/env.ts.
  trustHost: env.AUTH_TRUST_HOST,
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
