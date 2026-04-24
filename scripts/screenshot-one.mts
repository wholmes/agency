#!/usr/bin/env npx tsx
/**
 * One-off ScreenshotOne capture from the terminal.
 * Run with env loaded (repo uses dotenv-cli like other db scripts):
 *
 *   pnpm exec dotenv -e .env -e .env.local -- npx tsx scripts/screenshot-one.mts https://example.com hero ./out.jpg
 *
 * Args: <url> <hero|cover|thumbnail|mobile|gallery> <output.jpg> [viewport|full]
 *
 * - `viewport` — above the fold (one screen) for **hero**, **cover**, or **mobile** (default for those is full page except use this flag).
 * - `full` — full-page scroll capture for **thumbnail** or **gallery** (defaults for those are viewport-only).
 */

import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";

const { fetchScreenshotOneDataUrl } = await import("../src/lib/screenshotone");
type Preset = import("../src/lib/screenshotone").ScreenshotOneCapturePreset;

const url = process.argv[2];
const preset = process.argv[3] as Preset;
const outPath = process.argv[4];
const extraArg = process.argv[5]?.toLowerCase();

const presets: Preset[] = ["hero", "cover", "thumbnail", "mobile", "gallery"];
if (!url || !preset || !outPath || !presets.includes(preset)) {
  console.error(
    "Usage: pnpm exec dotenv -e .env -e .env.local -- npx tsx scripts/screenshot-one.mts <url> <hero|cover|thumbnail|mobile|gallery> <output.jpg> [viewport|full]",
  );
  process.exit(1);
}

if (extraArg && !["viewport", "full"].includes(extraArg)) {
  console.error('Optional 4th argument must be "viewport" or "full".');
  process.exit(1);
}

if (extraArg === "viewport" && !["hero", "cover", "mobile"].includes(preset)) {
  console.error('Optional argument "viewport" is only valid with hero, cover, or mobile presets.');
  process.exit(1);
}

if (extraArg === "full" && preset !== "thumbnail" && preset !== "gallery") {
  console.error('Optional argument "full" is only valid with the thumbnail or gallery preset.');
  process.exit(1);
}

const delay = Number(process.env.SCREENSHOTONE_CLI_DELAY_MS ?? "1000");
const fetchOpts =
  preset === "mobile"
    ? { mobileFullPage: extraArg !== "viewport" }
    : preset === "hero"
      ? { heroFullPage: extraArg !== "viewport" }
      : preset === "cover"
        ? { coverFullPage: extraArg !== "viewport" }
        : preset === "thumbnail"
          ? { thumbnailFullPage: extraArg === "full" }
          : preset === "gallery"
            ? { galleryFullPage: extraArg === "full" }
            : undefined;
const result = await fetchScreenshotOneDataUrl(preset, url, delay, fetchOpts);
if (!result.ok) {
  console.error(result.error);
  process.exit(1);
}

const b64 = result.dataUrl.split(",")[1];
if (!b64) {
  console.error("Unexpected data URL format");
  process.exit(1);
}
const buf = Buffer.from(b64, "base64");
const abs = resolve(outPath);
mkdirSync(dirname(abs), { recursive: true });
writeFileSync(abs, buf);
console.log("Wrote", abs, `(${buf.length} bytes)`);
