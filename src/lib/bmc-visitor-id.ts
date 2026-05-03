/** First-party visitor id for GA4 `client_id` when GTM reads it (cookie + early dataLayer). */
export const BMC_VISITOR_COOKIE_NAME = "bmc_vid";

const MAX_AGE_SEC = 60 * 60 * 24 * 730; // ~2 years

function parseCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const safe = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const m = document.cookie.match(new RegExp(`(?:^|; )${safe}=([^;]*)`));
  return m?.[1] ? decodeURIComponent(m[1].replace(/\+/g, " ")) : null;
}

/** Read the id if already set (client-only). */
export function readBmcVisitorIdCookie(): string | null {
  const v = parseCookie(BMC_VISITOR_COOKIE_NAME);
  return v && v.length > 0 ? v : null;
}

/** Ensure cookie exists; returns current id (client-only). */
export function ensureBmcVisitorIdCookie(): string {
  const existing = readBmcVisitorIdCookie();
  if (existing) return existing;
  const id =
    typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
      ? crypto.randomUUID()
      : `bmc_${Math.random().toString(36).slice(2)}${Date.now().toString(36)}`;
  const secure = typeof location !== "undefined" && location.protocol === "https:";
  const tail = secure ? ";Secure" : "";
  document.cookie = `${BMC_VISITOR_COOKIE_NAME}=${encodeURIComponent(id)};path=/;max-age=${MAX_AGE_SEC};SameSite=Lax${tail}`;
  return id;
}

/**
 * Self-contained script for `next/script` strategy="beforeInteractive".
 * Sets {@link BMC_VISITOR_COOKIE_NAME} cookie, seeds `dataLayer` with `{ bmc_vid }`.
 * Cookie name is duplicated in the string on purpose (keep one line, no TS interpolation bugs).
 */
export function bmcVisitorIdBootstrapInlineScript(): string {
  if (BMC_VISITOR_COOKIE_NAME !== "bmc_vid") {
    throw new Error("bmcVisitorIdBootstrapInlineScript: update hardcoded N= in the returned string");
  }
  const max = String(MAX_AGE_SEC);
  return (
    "(function(){" +
    "var N='bmc_vid',M=" +
    max +
    ";" +
    "function R(){var m=document.cookie.match(new RegExp('(?:^|; )'+N+'=([^;]*)'));" +
    "return m?decodeURIComponent((m[1]||'').split('+').join(' ')):'';}" +
    "function W(v){var s=typeof location!=='undefined'&&location.protocol==='https:';" +
    "document.cookie=N+'='+encodeURIComponent(v)+';path=/;max-age='+M+';SameSite=Lax'+(s?';Secure':'');}" +
    "var id=R();" +
    "if(!id){id=(typeof crypto!=='undefined'&&crypto.randomUUID)?crypto.randomUUID():" +
    "('bmc_'+Math.random().toString(36).slice(2)+Date.now().toString(36));W(id);}" +
    "window.dataLayer=window.dataLayer||[];" +
    "window.dataLayer.push({bmc_vid:id});" +
    "})();"
  );
}
