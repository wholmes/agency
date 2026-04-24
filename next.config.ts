import os from "node:os";
import type { NextConfig } from "next";

/** Non-loopback IPv4 addresses — used so dev works from http://<LAN-IP>:3000 on phones/tablets. */
function lanIPv4Hostnames(): string[] {
  const hosts: string[] = [];
  for (const addrs of Object.values(os.networkInterfaces())) {
    if (!addrs) continue;
    for (const a of addrs) {
      if (a.family === "IPv4" && !a.internal) hosts.push(a.address);
    }
  }
  return hosts;
}

const nextConfig: NextConfig = {
  // Prisma must not be bundled by Turbopack — delegates like `prisma.siteChrome` can be undefined otherwise.
  // https://www.prisma.io/docs/orm/more/help-and-troubleshooting/help-articles/nextjs-webpack-prisma
  serverExternalPackages: ["@prisma/client", "prisma"],

  experimental: {
    // Tree-shake framer-motion: only bundle the named exports actually imported.
    optimizePackageImports: ["framer-motion"],
    serverActions: {
      // Case study screenshots as base64 + blog S3 uploads via server actions.
      bodySizeLimit: "12mb",
    },
  },

  // Dev-only: Next blocks cross-origin requests to dev internals unless the browser's host is allowed.
  // Opening the site as http://192.168.x.x:3000 (vs localhost) counts as a different origin — without this,
  // RSC chunks / HMR / devtools can fail and the page looks half-loaded.
  ...(process.env.NODE_ENV !== "production" && {
    allowedDevOrigins: lanIPv4Hostnames(),
  }),
};

export default nextConfig;
