import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Prisma packages use Node.js APIs and WebAssembly — mark as server-external
  // so Turbopack doesn't attempt to bundle them for the client.
  serverExternalPackages: [
    "@prisma/client",
    "@prisma/adapter-pg",
    "@auth/prisma-adapter",
  ],
  turbopack: {},
};

export default nextConfig;
