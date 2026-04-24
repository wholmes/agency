"use server";

import { requireAdminSession } from "@/lib/admin/require-admin";
import {
  fetchScreenshotOneDataUrl,
  parseScreenshotOneAuthFields,
  type ScreenshotOneCapturePreset,
} from "@/lib/screenshotone";

export type CaptureScreenshotOneInput = {
  url: string;
  preset: ScreenshotOneCapturePreset;
  delayMs?: number;
  /** Only when `preset` is `hero`. Default `true` (full-page). */
  heroFullPage?: boolean;
  /** Only when `preset` is `cover`. Default `true` (full-page). */
  coverFullPage?: boolean;
  /** Only when `preset` is `thumbnail`. Default `false` (viewport). */
  thumbnailFullPage?: boolean;
  /** Only when `preset` is `mobile`. Default `true` (full-page). */
  mobileFullPage?: boolean;
  /** Only when `preset` is `gallery`. Default `false` (viewport / above the fold). */
  galleryFullPage?: boolean;
  /** ScreenshotOne `authorization` param (single line). Optional. */
  screenshotAuthorization?: string;
  /** One ScreenshotOne cookie string per line. Optional. */
  screenshotCookiesMultiline?: string;
  /** One `Header-Name: value` per line. Optional. */
  screenshotHeadersMultiline?: string;
};

export type CaptureScreenshotOneResult =
  | { ok: true; dataUrl: string }
  | { ok: false; error: string };

export async function captureScreenshotWithScreenshotOne(
  input: CaptureScreenshotOneInput,
): Promise<CaptureScreenshotOneResult> {
  await requireAdminSession();
  const delayMs = typeof input.delayMs === "number" && Number.isFinite(input.delayMs) ? input.delayMs : 800;
  const authParsed = parseScreenshotOneAuthFields({
    authorization: input.screenshotAuthorization,
    cookiesMultiline: input.screenshotCookiesMultiline,
    headersMultiline: input.screenshotHeadersMultiline,
  });
  if (!authParsed.ok) return { ok: false, error: authParsed.error };

  const authOpts =
    authParsed.authorization || authParsed.requestCookies.length || authParsed.requestHeaders.length
      ? {
          authorization: authParsed.authorization,
          requestCookies: authParsed.requestCookies.length ? authParsed.requestCookies : undefined,
          requestHeaders: authParsed.requestHeaders.length ? authParsed.requestHeaders : undefined,
        }
      : {};

  const presetOpts =
    input.preset === "mobile"
      ? { mobileFullPage: input.mobileFullPage !== false }
      : input.preset === "hero"
        ? { heroFullPage: input.heroFullPage !== false }
        : input.preset === "cover"
          ? { coverFullPage: input.coverFullPage !== false }
          : input.preset === "thumbnail"
            ? { thumbnailFullPage: input.thumbnailFullPage === true }
            : input.preset === "gallery"
              ? { galleryFullPage: input.galleryFullPage === true }
              : {};
  const fetchOpts = { ...presetOpts, ...authOpts };
  const result = await fetchScreenshotOneDataUrl(input.preset, input.url, delayMs, fetchOpts);
  if (!result.ok) return { ok: false, error: result.error };
  return { ok: true, dataUrl: result.dataUrl };
}
