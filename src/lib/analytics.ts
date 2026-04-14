/**
 * Server-side GA4 tracking via the Measurement Protocol.
 *
 * How it works:
 *  - GA4 client-side tags set a `_ga` cookie containing the client ID.
 *  - Server actions / API routes can read that cookie and forward it here so
 *    server events appear on the same user session in GA4 reports.
 *  - When no cookie is available (e.g. a bot or privacy-blocked browser) we
 *    generate a random client ID — the event still lands in GA4, just without
 *    being joined to a client session.
 *
 * Reference: https://developers.google.com/analytics/devguides/collection/protocol/ga4
 */

import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { randomUUID } from "node:crypto";

const MP_ENDPOINT = "https://www.google-analytics.com/mp/collect";
const MP_DEBUG_ENDPOINT = "https://www.google-analytics.com/debug/mp/collect";

export interface Ga4Event {
  name: string;
  params?: Record<string, string | number | boolean>;
}

interface MpConfig {
  measurementId: string;
  apiSecret: string;
}

/** Load GA4 measurement ID + API secret from DB (cached per request via React cache). */
async function getMpConfig(): Promise<MpConfig | null> {
  try {
    const seo = await prisma.seoSettings.findUnique({ where: { id: 1 } });
    if (!seo?.googleAnalyticsId?.startsWith("G-")) return null;
    if (!seo.googleAnalyticsApiSecret) return null;
    return {
      measurementId: seo.googleAnalyticsId,
      apiSecret: seo.googleAnalyticsApiSecret,
    };
  } catch {
    return null;
  }
}

/**
 * Extract the GA4 client ID from the `_ga` cookie.
 * The cookie value is `GA1.1.<client_id>` — the client ID is everything after
 * the second dot.
 */
async function getClientId(): Promise<string> {
  try {
    const store = await cookies();
    const raw = store.get("_ga")?.value ?? "";
    // Format: GA1.1.1234567890.1234567890
    const parts = raw.split(".");
    if (parts.length >= 4) return `${parts[2]}.${parts[3]}`;
  } catch { /* cookies() throws outside request context */ }
  // Fallback: random ID — still valid for Measurement Protocol
  return randomUUID();
}

/**
 * Send one or more events to GA4 via the Measurement Protocol.
 *
 * @param events  Array of GA4 events to send in a single batch (max 25).
 * @param options.debug  Set true to use the debug endpoint and log the response.
 * @param options.userId Optional authenticated user ID for cross-device tracking.
 */
export async function trackEvents(
  events: Ga4Event[],
  options: { debug?: boolean; userId?: string } = {},
): Promise<void> {
  const config = await getMpConfig();
  if (!config) return; // GA4 not configured — no-op

  const clientId = await getClientId();
  const endpoint = options.debug ? MP_DEBUG_ENDPOINT : MP_ENDPOINT;
  const url = `${endpoint}?measurement_id=${config.measurementId}&api_secret=${config.apiSecret}`;

  const body: Record<string, unknown> = {
    client_id: clientId,
    events: events.map((e) => ({ name: e.name, params: e.params ?? {} })),
  };
  if (options.userId) body.user_id = options.userId;

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (options.debug) {
      const text = await res.text();
      console.log("[GA4 debug]", text);
    }
  } catch (err) {
    // Never let analytics failures break user-facing flows
    console.error("[GA4 Measurement Protocol] Failed to send events:", err);
  }
}

/** Convenience: track a single event. */
export function trackEvent(
  name: string,
  params?: Ga4Event["params"],
  options?: Parameters<typeof trackEvents>[1],
): Promise<void> {
  return trackEvents([{ name, params }], options);
}
