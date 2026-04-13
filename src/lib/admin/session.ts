import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

const COOKIE_NAME = "admin_session";
const MAX_AGE_SEC = 60 * 60 * 24 * 7; // 7 days

function getSigningSecret(): string {
  const s = process.env.ADMIN_SESSION_SECRET ?? process.env.ADMIN_PASSWORD;
  if (!s || s.length < 8) {
    throw new Error(
      "Set ADMIN_PASSWORD (8+ chars) or ADMIN_SESSION_SECRET for the admin UI.",
    );
  }
  return s;
}

function verifyTokenString(token: string | undefined): boolean {
  if (!token) return false;
  const parts = token.split(".");
  if (parts.length !== 2) return false;
  const [payload, sig] = parts;
  if (!payload || !sig) return false;
  let secret: string;
  let expected: Buffer;
  try {
    secret = getSigningSecret();
    expected = createHmac("sha256", secret).update(payload).digest();
  } catch {
    return false;
  }
  const sigBuf = Buffer.from(sig, "base64url");
  if (sigBuf.length !== expected.length) return false;
  if (!timingSafeEqual(sigBuf, expected)) return false;
  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as { exp?: number };
    if (typeof data.exp !== "number" || Date.now() >= data.exp) return false;
  } catch {
    return false;
  }
  return true;
}

export async function isAdminSession(): Promise<boolean> {
  try {
    const store = await cookies();
    return verifyTokenString(store.get(COOKIE_NAME)?.value);
  } catch {
    return false;
  }
}

export async function setAdminSessionCookie(): Promise<void> {
  const secret = getSigningSecret();
  const exp = Date.now() + MAX_AGE_SEC * 1000;
  const payload = Buffer.from(JSON.stringify({ exp })).toString("base64url");
  const sig = createHmac("sha256", secret).update(payload).digest("base64url");
  const token = `${payload}.${sig}`;
  const store = await cookies();
  store.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE_SEC,
  });
}

export async function clearAdminSessionCookie(): Promise<void> {
  const store = await cookies();
  store.set(COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}

export function isAdminPasswordConfigured(): boolean {
  const p = process.env.ADMIN_PASSWORD;
  return typeof p === "string" && p.length >= 8;
}
