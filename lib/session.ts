import "server-only";
import { auth } from "@/lib/auth";
import { env } from "@/lib/env";

export type SessionUser = {
  email: string;
  name: string | null;
  image: string | null;
};

const MOCK_ENABLED = env.NODE_ENV === "development" && Boolean(env.MOCK_SESSION_EMAIL);

export async function getSessionUser(): Promise<SessionUser | null> {
  if (MOCK_ENABLED && env.MOCK_SESSION_EMAIL) {
    return { email: env.MOCK_SESSION_EMAIL, name: "Dev User", image: null };
  }
  const session = await auth();
  const email = session?.user?.email;
  if (!email) return null;
  return {
    email,
    name: session.user?.name ?? null,
    image: session.user?.image ?? null,
  };
}
