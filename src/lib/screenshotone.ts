import { createHmac } from "node:crypto";

const TAKE_BASE = "https://api.screenshotone.com/take";

export type ScreenshotOneCapturePreset = "hero" | "cover" | "thumbnail" | "mobile" | "gallery";

/** Optional flags per preset; unknown keys ignored by callers. */
export type ScreenshotOneFetchOptions = {
  /** Hero preset only. `true` (default) = full-page scroll capture; `false` = one viewport (“above the fold”). */
  heroFullPage?: boolean;
  /** Cover preset only. `true` (default) = full-page scroll capture; `false` = one viewport (“above the fold”). */
  coverFullPage?: boolean;
  /** Thumbnail preset only. `false` (default) = one viewport; `true` = full-page scroll capture. */
  thumbnailFullPage?: boolean;
  /** Mobile preset only. `true` (default) = full-page scroll capture; `false` = one viewport (“above the fold”). */
  mobileFullPage?: boolean;
  /** Gallery preset only. `false` (default) = one viewport; `true` = full-page scroll capture. */
  galleryFullPage?: boolean;
};

function getAccessKey(): string | undefined {
  return (
    process.env.SCREENSHOTONE_ACCESS_KEY?.trim() ||
    process.env.SCREENSHOTONE_API_KEY?.trim() ||
    undefined
  );
}

function getSecretKey(): string | undefined {
  return (
    process.env.SCREENSHOTONE_SECRET_KEY?.trim() ||
    process.env.SCREENSHOTONE_SECRET?.trim() ||
    undefined
  );
}

/** Normalize URL for ScreenshotOne; blocks obvious SSRF except localhost over http. */
export function assertScreenshotTargetUrl(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) throw new Error("URL is required.");
  let u: URL;
  try {
    u = new URL(trimmed);
  } catch {
    throw new Error("Invalid URL.");
  }
  if (u.protocol === "https:") return u.toString();
  if (u.protocol === "http:" && (u.hostname === "localhost" || u.hostname === "127.0.0.1")) {
    return u.toString();
  }
  throw new Error("Only https URLs are allowed (http is ok for localhost only).");
}

function presetEntries(
  preset: ScreenshotOneCapturePreset,
  url: string,
  delayMs: number,
  options?: ScreenshotOneFetchOptions,
): [string, string][] {
  // API `delay` is in seconds (max 30 for sync captures); UI passes milliseconds.
  const delaySec = Math.min(30, Math.max(0, delayMs / 1000));
  const delay = String(Number(delaySec.toFixed(3)));
  const base: [string, string][] = [
    ["format", "jpeg"],
    ["image_quality", "82"],
    ["delay", delay],
    ["url", url],
  ];

  switch (preset) {
    case "hero": {
      const fullPage = options?.heroFullPage !== false;
      if (fullPage) {
        return [
          ["viewport_width", "1600"],
          ["viewport_height", "900"],
          ["full_page", "true"],
          ["full_page_max_height", "10000"],
          ...base,
        ];
      }
      return [
        ["viewport_width", "1600"],
        ["viewport_height", "900"],
        ["full_page", "false"],
        ...base,
      ];
    }
    case "cover": {
      const fullPage = options?.coverFullPage !== false;
      if (fullPage) {
        return [
          ["viewport_width", "1440"],
          ["viewport_height", "810"],
          ["full_page", "true"],
          ["full_page_max_height", "10000"],
          ...base,
        ];
      }
      return [
        ["viewport_width", "1440"],
        ["viewport_height", "810"],
        ["full_page", "false"],
        ...base,
      ];
    }
    case "thumbnail": {
      const fullPage = options?.thumbnailFullPage === true;
      if (fullPage) {
        return [
          ["viewport_width", "1280"],
          ["viewport_height", "720"],
          ["full_page", "true"],
          ["full_page_max_height", "10000"],
          ...base,
        ];
      }
      return [
        ["viewport_width", "1280"],
        ["viewport_height", "720"],
        ["full_page", "false"],
        ...base,
      ];
    }
    case "mobile": {
      const fullPage = options?.mobileFullPage !== false;
      if (fullPage) {
        return [
          ["viewport_width", "390"],
          ["viewport_height", "844"],
          ["viewport_mobile", "true"],
          ["device_scale_factor", "2"],
          ["full_page", "true"],
          ["full_page_max_height", "6000"],
          ...base,
        ];
      }
      return [
        ["viewport_width", "390"],
        ["viewport_height", "844"],
        ["viewport_mobile", "true"],
        ["device_scale_factor", "2"],
        ["full_page", "false"],
        ...base,
      ];
    }
    case "gallery": {
      const fullPage = options?.galleryFullPage === true;
      if (fullPage) {
        return [
          ["viewport_width", "1440"],
          ["viewport_height", "900"],
          ["full_page", "true"],
          ["full_page_max_height", "10000"],
          ...base,
        ];
      }
      return [
        ["viewport_width", "1440"],
        ["viewport_height", "900"],
        ["full_page", "false"],
        ...base,
      ];
    }
    default: {
      const _exhaustive: never = preset;
      return _exhaustive;
    }
  }
}

/** Build ordered query string (without signature) for ScreenshotOne /take. */
export function buildScreenshotOneQueryString(
  accessKey: string,
  preset: ScreenshotOneCapturePreset,
  targetUrl: string,
  delayMs: number,
  options?: ScreenshotOneFetchOptions,
): string {
  const rows: [string, string][] = [["access_key", accessKey], ...presetEntries(preset, targetUrl, delayMs, options)];
  const usp = new URLSearchParams();
  for (const [k, v] of rows) {
    usp.append(k, v);
  }
  return usp.toString();
}

export function signScreenshotOneQueryString(queryString: string, secret: string): string {
  return createHmac("sha256", secret).update(queryString).digest("hex");
}

export function buildScreenshotOneTakeUrl(
  accessKey: string,
  secret: string | undefined,
  preset: ScreenshotOneCapturePreset,
  targetUrl: string,
  delayMs: number,
  options?: ScreenshotOneFetchOptions,
): string {
  const qs = buildScreenshotOneQueryString(accessKey, preset, targetUrl, delayMs, options);
  if (secret) {
    const sig = signScreenshotOneQueryString(qs, secret);
    return `${TAKE_BASE}?${qs}&signature=${sig}`;
  }
  return `${TAKE_BASE}?${qs}`;
}

export type ScreenshotOneFetchResult =
  | { ok: true; dataUrl: string; contentType: string }
  | { ok: false; error: string };

/** ScreenshotOne error JSON (see https://screenshotone.com/docs/errors). */
function formatScreenshotOneApiError(raw: string, fallbackStatus: string): string {
  try {
    const j = JSON.parse(raw) as {
      error_message?: string;
      error_code?: string;
      error_details?: unknown;
      error?: { message?: string; code?: string };
    };
    const msg =
      (typeof j.error_message === "string" && j.error_message.trim()) ||
      j.error?.message ||
      fallbackStatus;
    const code = (typeof j.error_code === "string" && j.error_code.trim()) || j.error?.code;
    let out = code ? `${msg} (${code})` : msg;
    if (j.error_details !== undefined && j.error_details !== null) {
      const detail =
        typeof j.error_details === "string"
          ? j.error_details
          : JSON.stringify(j.error_details);
      if (detail && detail !== "{}" && detail.length < 500) {
        out += ` — ${detail}`;
      }
    }
    return out;
  } catch {
    return raw.trim().slice(0, 500) || fallbackStatus;
  }
}

/** Fetch screenshot from ScreenshotOne and return a data URL (server-side). */
export async function fetchScreenshotOneDataUrl(
  preset: ScreenshotOneCapturePreset,
  targetUrl: string,
  delayMs: number,
  options?: ScreenshotOneFetchOptions,
): Promise<ScreenshotOneFetchResult> {
  const accessKey = getAccessKey();
  if (!accessKey) {
    return { ok: false, error: "Missing SCREENSHOTONE_ACCESS_KEY (or SCREENSHOTONE_API_KEY) in environment." };
  }
  const secret = getSecretKey();
  const safeUrl = assertScreenshotTargetUrl(targetUrl);
  const apiUrl = buildScreenshotOneTakeUrl(accessKey, secret, preset, safeUrl, delayMs, options);

  let res: Response;
  try {
    res = await fetch(apiUrl, { cache: "no-store", signal: AbortSignal.timeout(120_000) });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Network error";
    return { ok: false, error: `ScreenshotOne request failed: ${msg}` };
  }

  const buf = Buffer.from(await res.arrayBuffer());
  if (!res.ok) {
    const text = buf.toString("utf8");
    return { ok: false, error: formatScreenshotOneApiError(text, res.statusText) };
  }

  const contentType = res.headers.get("content-type")?.split(";")[0]?.trim() || "image/jpeg";
  const dataUrl = `data:${contentType};base64,${buf.toString("base64")}`;
  return { ok: true, dataUrl, contentType };
}
