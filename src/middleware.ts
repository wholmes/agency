import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import type { RedirectEntry } from "@/app/api/redirects/route";

/**
 * Vercel Routing Middleware — runs on the Edge before every matched request.
 *
 * Redirect rules are stored in the DB and served via /api/redirects (cached
 * 60 s at the CDN edge). The middleware fetch therefore almost never hits the
 * database directly.
 *
 * Supports:
 *   - Exact path matches   (/old-page → /new-page)
 *   - Wildcard suffixes    (/blog/*   → /journal/*)
 *   - External destinations (https://example.com)
 *   - 307 Temporary / 308 Permanent
 */
export async function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  // In local dev, skip the in-app fetch: same-origin /api/redirects from middleware can
  // block the only worker (middleware waits for Prisma, API never runs → tab spins forever),
  // and a slow DB makes it worse. Production keeps DB-backed redirects.
  if (process.env.NODE_ENV === "development") {
    return NextResponse.next();
  }

  // ── Fetch the redirect list (edge-cached, ~60 s TTL) ──────────────────────
  let redirects: RedirectEntry[] = [];
  try {
    const apiUrl = new URL("/api/redirects", request.nextUrl.origin);
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8_000);
    const res = await fetch(apiUrl.toString(), {
      next: { revalidate: 60 },
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    if (res.ok) {
      const body = (await res.json()) as { redirects: RedirectEntry[] };
      redirects = body.redirects ?? [];
    }
  } catch {
    // If the API is unreachable, times out, or DB is down — do not block the request.
    return NextResponse.next();
  }

  if (redirects.length === 0) return NextResponse.next();

  // ── Match ─────────────────────────────────────────────────────────────────
  for (const rule of redirects) {
    const matched = matchRedirect(rule.source, pathname);
    if (!matched) continue;

    const destination = resolveDestination(rule.destination, matched.rest, request, search);
    const status = rule.permanent ? 308 : 307;
    return NextResponse.redirect(destination, { status });
  }

  return NextResponse.next();
}

/**
 * Returns null when the source doesn't match.
 * Returns `{ rest }` — the captured wildcard suffix — when it does.
 *
 * Supported source patterns:
 *   /exact-path          — exact match (case-insensitive)
 *   /prefix/*            — wildcard: captures everything after the last /
 */
function matchRedirect(
  source: string,
  pathname: string,
): { rest: string } | null {
  const normalSource = source.toLowerCase().replace(/\/$/, "") || "/";
  const normalPath = pathname.toLowerCase().replace(/\/$/, "") || "/";

  if (normalSource.endsWith("/*")) {
    const prefix = normalSource.slice(0, -2); // strip /*
    if (normalPath === prefix || normalPath.startsWith(prefix + "/")) {
      return { rest: normalPath.slice(prefix.length) };
    }
    return null;
  }

  return normalSource === normalPath ? { rest: "" } : null;
}

/**
 * Resolves the final redirect URL.
 *
 * If the destination contains `*` it is replaced with the wildcard capture.
 * Relative destinations are resolved against the request origin.
 * Absolute URLs (http/https) are used as-is.
 */
function resolveDestination(
  destination: string,
  rest: string,
  request: NextRequest,
  search: string,
): URL {
  const resolved = destination.replace("*", rest);

  if (/^https?:\/\//i.test(resolved)) {
    return new URL(resolved);
  }

  const url = new URL(resolved, request.nextUrl.origin);
  // Preserve original query string when destination has none
  if (!url.search && search) url.search = search;
  return url;
}

// ── Matcher config ────────────────────────────────────────────────────────────
// Skip static assets, Next.js internals, and the redirects API itself to
// avoid fetch loops and unnecessary overhead.
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon\\.ico|api/redirects|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|woff2?|ttf)).*)",
  ],
};
