import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Prisma must not be bundled by Turbopack — delegates like `prisma.siteChrome` can be undefined otherwise.
  // https://www.prisma.io/docs/orm/more/help-and-troubleshooting/help-articles/nextjs-webpack-prisma
  serverExternalPackages: ["@prisma/client", "prisma"],
};

export default nextConfig;
