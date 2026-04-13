import { PrismaClient } from "@prisma/client";

// Using a direct postgresql:// connection.
// When switching to Prisma Postgres Accelerate (prisma+postgres:// URL), restore:
//   import { withAccelerate } from "@prisma/extension-accelerate";
//   and wrap the client: new PrismaClient(...).$extends(withAccelerate())

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
