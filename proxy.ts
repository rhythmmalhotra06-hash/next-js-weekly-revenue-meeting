// Proxy passthrough (Next.js 16 successor to middleware).
//
// We can't run auth here because the Prisma adapter pulls in pg which uses
// Node.js crypto — incompatible with the Edge runtime.
//
// Auth gating happens in app/(authed)/layout.tsx instead: every protected
// page calls getSessionUser() and redirects to /sign-in if unauthenticated.

import { NextResponse } from "next/server";

export function proxy() {
  return NextResponse.next();
}

export const config = {
  matcher: [],
};
