import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import { env } from "@/lib/env";

// Boot sentinel — confirms the deployed image contains this commit AND
// surfaces the auth-relevant env so we can diagnose redirect_uri_mismatch.
// The `expected_callback` value must match a Google OAuth Console
// "Authorized redirect URI" byte-for-byte.
{
  const authUrl = process.env.AUTH_URL || "(unset)";
  const expectedCallback = process.env.AUTH_URL
    ? process.env.AUTH_URL.replace(/\/$/, "") + "/api/auth/callback/google"
    : "(unset — AUTH_URL not set)";
  console.log(
    "[auth] init: trustHost=true"
      + " allowedDomain=" + env.AUTH_ALLOWED_EMAIL_DOMAIN
      + " AUTH_URL=" + authUrl
      + " expected_callback=" + expectedCallback,
  );
}

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
