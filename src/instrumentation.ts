/**
 * Warms the Prisma + Neon connection with retries on **production** (`next start`, Vercel).
 * In `next dev` we skip this entirely so a slow/unreachable DB does not block startup or spam
 * retries; the first page load still connects via Prisma as usual.
 *
 * @see https://neon.com/docs/connect/connection-latency
 */
function isRetriableConnectError(e: unknown): boolean {
  if (!e || typeof e !== "object") {
    return false;
  }
  const o = e as { errorCode?: string; message?: string; name?: string };
  if (o.errorCode === "P1001") {
    return true;
  }
  if (o.name === "PrismaClientInitializationError") {
    return true;
  }
  const m = String(o.message ?? "");
  if (m.includes("Timed out fetching a new connection from the connection pool")) {
    return true;
  }
  if (/Can'?t reach database server/i.test(m)) {
    return true;
  }
  return false;
}

export async function register() {
  if (process.env.NEXT_RUNTIME === "edge") {
    return;
  }

  if (process.env.NODE_ENV === "development" && process.env.PRISMA_DEV_WARM !== "1") {
    return;
  }

  const { prisma } = await import("@/lib/prisma");
  const maxAttempts = 5;
  const baseDelayMs = 2000;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      await prisma.$connect();
      if (process.env.NODE_ENV === "development") {
        // eslint-disable-next-line no-console -- dev-only warm confirmation
        console.log("[prisma] connected to database");
      }
      return;
    } catch (e) {
      const last = attempt === maxAttempts - 1;

      if (!isRetriableConnectError(e)) {
        // eslint-disable-next-line no-console
        console.error("[prisma] $connect (non-retriable):", e);
        throw e;
      }
      if (last) {
        // eslint-disable-next-line no-console
        console.error("[prisma] $connect failed after all retries; first request may still connect:", e);
        return;
      }
      const delay = baseDelayMs * (attempt + 1);
      if (process.env.NODE_ENV === "development") {
        // eslint-disable-next-line no-console
        console.warn(
          `[prisma] connect retry ${attempt + 2}/${maxAttempts} in ${delay}ms (Neon cold start)`,
        );
      }
      await new Promise((r) => setTimeout(r, delay));
    }
  }
}
