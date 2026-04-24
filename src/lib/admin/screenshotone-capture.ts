"use server";

import { requireAdminSession } from "@/lib/admin/require-admin";
import {
  fetchScreenshotOneDataUrl,
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
};

export type CaptureScreenshotOneResult =
  | { ok: true; dataUrl: string }
  | { ok: false; error: string };

export async function captureScreenshotWithScreenshotOne(
  input: CaptureScreenshotOneInput,
): Promise<CaptureScreenshotOneResult> {
  await requireAdminSession();
  const delayMs = typeof input.delayMs === "number" && Number.isFinite(input.delayMs) ? input.delayMs : 800;
  const fetchOpts =
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
              : undefined;
  const result = await fetchScreenshotOneDataUrl(input.preset, input.url, delayMs, fetchOpts);
  if (!result.ok) return { ok: false, error: result.error };
  return { ok: true, dataUrl: result.dataUrl };
}
