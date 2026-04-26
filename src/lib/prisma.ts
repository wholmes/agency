import { PrismaClient } from "@prisma/client";

// Using a direct postgresql:// connection.
// When switching to Prisma Postgres Accelerate (prisma+postgres:// URL), restore:
//   import { withAccelerate } from "@prisma/extension-accelerate";
//   and wrap the client: new PrismaClient(...).$extends(withAccelerate())

/** Bump when Prisma client / URL shaping changes so dev HMR does not reuse an old pool. */
const PRISMA_CLIENT_CONFIG_VERSION = 5;

type GlobalPrisma = typeof globalThis & {
  __prisma?: PrismaClient;
  __prismaClientConfigVersion?: number;
};

const g = globalThis as GlobalPrisma;

/** Neon “Connect” strings often include `channel_binding=require`; Prisma/Node can surface P1001 when it stays on. */
function stripChannelBindingParam(connectionString: string): string {
  try {
    const u = new URL(connectionString);
    u.searchParams.delete("channel_binding");
    return u.toString();
  } catch {
    return connectionString
      .replace(/([?&])channel_binding=[^&]*/gi, "$1")
      .replace(/\?&/g, "?")
      .replace(/&&/g, "&")
      .replace(/[?&]$/g, "");
  }
}

/**
 * Neon pooler + Prisma: generous timeouts for scale-to-zero (compute wake can exceed a few
 * seconds). Strips `channel_binding` (Prisma engine), sets `pgbouncer=true` on pooler hosts, and
 * on Vercel uses `connection_limit=1` per Neon + Prisma serverless guidance.
 * @see https://neon.com/docs/connect/connection-latency
 */
function buildRuntimeDatabaseUrl(): string {
  const raw = process.env.POSTGRES_PRISMA_URL;
  if (!raw?.trim()) {
    throw new Error("POSTGRES_PRISMA_URL is not set");
  }
  const withoutChannelBinding = stripChannelBindingParam(raw.trim());
  let url: URL;
  try {
    url = new URL(withoutChannelBinding);
  } catch {
    const sep = withoutChannelBinding.includes("?") ? "&" : "?";
    const pooler = withoutChannelBinding.includes("pooler") || withoutChannelBinding.includes("pgbouncer");
    return `${withoutChannelBinding}${sep}connect_timeout=60&pool_timeout=120${pooler ? "&pgbouncer=true" : ""}`;
  }

  const host = url.hostname;
  // Local Docker / Homebrew Postgres: do not add Neon/pooler-only params; they can cause odd
  // Prisma P1010 "denied access" when another server on :5432 was hit or params confuse libpq.
  if (host === "127.0.0.1" || host === "localhost" || host === "::1") {
    if (!url.searchParams.has("sslmode")) {
      url.searchParams.set("sslmode", "prefer");
    }
    const ct = Number(url.searchParams.get("connect_timeout") ?? "0");
    if (!Number.isFinite(ct) || ct < 5) {
      url.searchParams.set("connect_timeout", "15");
    }
    url.searchParams.delete("pool_timeout");
    url.searchParams.delete("pgbouncer");
    return url.toString();
  }

  const pooler = host.includes("pooler") || host.includes("pgbouncer");

  // Neon defaults (e.g. pool_timeout=10) are too low when compute is suspended.
  const poolT = Number(url.searchParams.get("pool_timeout") ?? "0");
  if (!Number.isFinite(poolT) || poolT < 90) {
    url.searchParams.set("pool_timeout", "120");
  }
  const connT = Number(url.searchParams.get("connect_timeout") ?? "0");
  if (!Number.isFinite(connT) || connT < 50) {
    url.searchParams.set("connect_timeout", "60");
  }
  if (pooler && !url.searchParams.has("pgbouncer")) {
    url.searchParams.set("pgbouncer", "true");
  }
  if (pooler && process.env.VERCEL) {
    url.searchParams.set("connection_limit", "1");
  }
  return url.toString();
}

function createPrismaClient(): PrismaClient {
  return new PrismaClient({
    datasources: {
      db: { url: buildRuntimeDatabaseUrl() },
    },
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });
}

function getOrCreatePrisma(): PrismaClient {
  if (g.__prisma && g.__prismaClientConfigVersion === PRISMA_CLIENT_CONFIG_VERSION) {
    return g.__prisma;
  }
  if (g.__prisma) {
    void g.__prisma.$disconnect().catch(() => {});
    g.__prisma = undefined;
  }
  g.__prisma = createPrismaClient();
  g.__prismaClientConfigVersion = PRISMA_CLIENT_CONFIG_VERSION;
  return g.__prisma;
}

export const prisma = getOrCreatePrisma();
