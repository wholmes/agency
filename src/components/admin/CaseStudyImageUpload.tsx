"use client";

import { useRef, useState, useId, useEffect } from "react";
import { captureScreenshotWithScreenshotOne } from "@/lib/admin/screenshotone-capture";
import type { ScreenshotOneCapturePreset } from "@/lib/screenshotone";
import { useAdminToast } from "@/components/admin/AdminToast";

/** Gallery images are shown in a wide lightbox; encode larger than old 1440×900 to avoid soft / pixelated JPEGs. */
const GALLERY_MAX_ENCODE_W = 2400;
const GALLERY_MAX_ENCODE_H = 1500;
const GALLERY_JPEG_QUALITY = 0.9;

function isNextRedirect(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "digest" in error &&
    typeof (error as { digest?: string }).digest === "string" &&
    String((error as { digest: string }).digest).startsWith("NEXT_REDIRECT")
  );
}

interface ImageSlot {
  name: string;           /* form field name */
  label: string;
  idealDims: string;      /* recommended capture dimensions */
  displayCtx: string;     /* where it renders + display width */
  aspect: string;         /* aspect ratio label */
  previewW: number;       /* preview box width  (px) */
  previewH: number;       /* preview box height (px) */
  maxW: number;           /* resize cap — width  */
  maxH: number;           /* resize cap — height */
  quality?: number;       /* jpeg quality 0–1, defaults to 0.85 */
}

const SLOTS: ImageSlot[] = [
  {
    name: "thumbImage",
    label: "Card thumbnail",
    idealDims: "1280 × 720 px",
    displayCtx:
      "Homepage cards · renders ~500 px wide · ScreenshotOne defaults to above the fold; optional full-page capture then scaled to 1280×720",
    aspect: "16 : 9",
    previewW: 192,
    previewH: 108,
    maxW: 1280,
    maxH: 720,
  },
  {
    name: "coverImage",
    label: "Listing cover",
    idealDims: "1440 × 810 px",
    displayCtx:
      "/work page cards · renders ~620 px wide · ScreenshotOne defaults to full page (entire scroll) scaled into 1440×810",
    aspect: "16 : 9",
    previewW: 192,
    previewH: 108,
    maxW: 1440,
    maxH: 810,
  },
  {
    name: "heroImage",
    label: "Case study hero",
    idealDims: "1600 px wide · any height",
    displayCtx: "Detail page browser window · renders up to 1024 px wide · full-page screenshots scroll in the browser frame",
    aspect: "any",
    previewW: 256,
    previewH: 144,
    maxW: 1600,
    maxH: 99999,
    quality: 0.78,
  },
  {
    name: "mobileImage",
    label: "Mobile screenshot",
    idealDims: "780 px wide · any height",
    displayCtx:
      "Phone mockup on detail page · renders ~192 px wide · long screenshots scroll inside the phone frame (capture or upload)",
    aspect: "any",
    previewW: 72,
    previewH: 156,
    maxW: 780,
    maxH: 99999,
    quality: 0.78,
  },
];

function processImage(file: File, maxW: number, maxH: number, quality = 0.85): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    img.onload = () => {
      const scale = Math.min(1, maxW / img.width, maxH / img.height);
      const w = Math.round(img.width  * scale);
      const h = Math.round(img.height * scale);
      const c = document.createElement("canvas");
      c.width  = w;
      c.height = h;
      c.getContext("2d")!.drawImage(img, 0, 0, w, h);
      URL.revokeObjectURL(img.src);
      resolve(c.toDataURL("image/jpeg", quality));
    };
    img.onerror = () => { URL.revokeObjectURL(img.src); reject(new Error("Could not read image")); };
    img.src = URL.createObjectURL(file);
  });
}

function resizeDataUrl(dataUrl: string, maxW: number, maxH: number, quality = 0.85): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    img.onload = () => {
      const scale = Math.min(1, maxW / img.width, maxH / img.height);
      const w = Math.round(img.width * scale);
      const h = Math.round(img.height * scale);
      const c = document.createElement("canvas");
      c.width = w;
      c.height = h;
      c.getContext("2d")!.drawImage(img, 0, 0, w, h);
      resolve(c.toDataURL("image/jpeg", quality));
    };
    img.onerror = () => reject(new Error("Could not decode screenshot"));
    img.src = dataUrl;
  });
}

type CaptureDestination = "thumbImage" | "coverImage" | "heroImage" | "mobileImage" | "gallery";

function destinationToPreset(dest: CaptureDestination): ScreenshotOneCapturePreset {
  switch (dest) {
    case "thumbImage":
      return "thumbnail";
    case "coverImage":
      return "cover";
    case "heroImage":
      return "hero";
    case "mobileImage":
      return "mobile";
    case "gallery":
      return "gallery";
    default: {
      const _e: never = dest;
      return _e;
    }
  }
}

const DESTINATION_LABEL: Record<CaptureDestination, string> = {
  thumbImage: "Card thumbnail",
  coverImage: "Listing cover",
  heroImage: "Case study hero",
  mobileImage: "Mobile mockup",
  gallery: "Gallery",
};

interface SlotState {
  url: string;
  processing: boolean;
  error: string;
}

interface ScreenshotItem {
  id: string;
  url: string;
  caption: string;
  processing: boolean;
  error: string;
}

interface Props {
  thumbImage?: string;
  coverImage?: string;
  heroImage?: string;
  mobileImage?: string;
  screenshots?: string; // JSON string
  /** Prefills the ScreenshotOne URL field (e.g. known live site for this project). */
  defaultCaptureUrl?: string;
}

export default function CaseStudyImageUpload({
  thumbImage = "",
  coverImage = "",
  heroImage = "",
  mobileImage = "",
  screenshots = "[]",
  defaultCaptureUrl = "",
}: Props) {
  const { success, error } = useAdminToast();
  const defaults: Record<string, string> = { thumbImage, coverImage, heroImage, mobileImage };
  const uid = useId();

  const [states, setStates] = useState<Record<string, SlotState>>(() =>
    Object.fromEntries(SLOTS.map(s => [s.name, { url: defaults[s.name] ?? "", processing: false, error: "" }]))
  );

  // Parse initial screenshots
  const [shots, setShots] = useState<ScreenshotItem[]>(() => {
    try {
      const parsed = JSON.parse(screenshots) as unknown;
      if (!Array.isArray(parsed)) return [];
      return parsed
        .filter((x) => x && typeof x === "object" && typeof (x as { url?: unknown }).url === "string")
        .map((x, i) => ({
          id: `init-${i}`,
          url: String((x as { url: string }).url),
          caption: String((x as { caption?: unknown }).caption ?? ""),
          processing: false,
          error: "",
        }));
    } catch {
      return [];
    }
  });

  const [addError, setAddError] = useState("");
  const [captureUrl, setCaptureUrl] = useState(defaultCaptureUrl);
  const [captureDestination, setCaptureDestination] = useState<CaptureDestination>("heroImage");
  /** ScreenshotOne hero preset only: full scroll vs single viewport. */
  const [heroCaptureFullPage, setHeroCaptureFullPage] = useState(true);
  /** ScreenshotOne cover preset only; default full page for /work listing art. */
  const [coverCaptureFullPage, setCoverCaptureFullPage] = useState(true);
  /** ScreenshotOne thumbnail preset only; default above-the-fold for small cards. */
  const [thumbCaptureFullPage, setThumbCaptureFullPage] = useState(false);
  /** ScreenshotOne mobile preset only: full scroll vs single viewport. */
  const [mobileCaptureFullPage, setMobileCaptureFullPage] = useState(true);
  /** ScreenshotOne gallery preset only; default above-the-fold (1440×900 viewport). */
  const [galleryCaptureFullPage, setGalleryCaptureFullPage] = useState(false);
  const [captureDelayMs, setCaptureDelayMs] = useState(1000);
  const [galleryCaptureCaption, setGalleryCaptureCaption] = useState("");
  const [captureBusy, setCaptureBusy] = useState(false);
  const [captureError, setCaptureError] = useState("");
  const [imagePreview, setImagePreview] = useState<{ src: string; label: string } | null>(null);
  const screenshotFileRef = useRef<HTMLInputElement | null>(null);
  const fileRefs = useRef<Record<string, HTMLInputElement | null>>({});

  useEffect(() => {
    if (!imagePreview) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setImagePreview(null);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [imagePreview]);

  const setSlot = (name: string, patch: Partial<SlotState>) =>
    setStates(prev => ({ ...prev, [name]: { ...prev[name], ...patch } }));

  const handleFile = async (slot: ImageSlot, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) { setSlot(slot.name, { error: "Please choose an image file." }); return; }
    setSlot(slot.name, { processing: true, error: "" });
    try {
      const dataUrl = await processImage(file, slot.maxW, slot.maxH, slot.quality);
      setSlot(slot.name, { url: dataUrl, processing: false });
    } catch (err) {
      setSlot(slot.name, { processing: false, error: err instanceof Error ? err.message : "Could not process image" });
    } finally {
      const ref = fileRefs.current[slot.name];
      if (ref) ref.value = "";
    }
  };

  const handleScreenshotFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    e.target.value = "";
    if (!files.length) return;
    setAddError("");

    const placeholders: ScreenshotItem[] = files.map((_, i) => ({
      id: `new-${Date.now()}-${i}`,
      url: "",
      caption: "",
      processing: true,
      error: "",
    }));

    setShots(prev => [...prev, ...placeholders]);

    await Promise.all(
      files.map(async (file, i) => {
        const pid = placeholders[i].id;
        if (!file.type.startsWith("image/")) {
          setShots(prev => prev.map(s => s.id === pid ? { ...s, processing: false, error: "Not an image" } : s));
          return;
        }
        try {
          const url = await processImage(
            file,
            GALLERY_MAX_ENCODE_W,
            GALLERY_MAX_ENCODE_H,
            GALLERY_JPEG_QUALITY,
          );
          setShots(prev => prev.map(s => s.id === pid ? { ...s, url, processing: false } : s));
        } catch {
          setShots(prev => prev.map(s => s.id === pid ? { ...s, processing: false, error: "Could not process" } : s));
        }
      })
    );
  };

  const removeShot = (id: string) => setShots(prev => prev.filter(s => s.id !== id));
  const updateCaption = (id: string, caption: string) =>
    setShots(prev => prev.map(s => s.id === id ? { ...s, caption } : s));
  const moveShot = (id: string, dir: -1 | 1) => {
    setShots(prev => {
      const idx = prev.findIndex(s => s.id === id);
      if (idx < 0) return prev;
      const next = idx + dir;
      if (next < 0 || next >= prev.length) return prev;
      const arr = [...prev];
      [arr[idx], arr[next]] = [arr[next], arr[idx]];
      return arr;
    });
  };

  const screenshotsJson = JSON.stringify(
    shots.filter(s => s.url).map(s => ({ url: s.url, ...(s.caption ? { caption: s.caption } : {}) }))
  );

  const runScreenshotOneCapture = async () => {
    setCaptureError("");
    setCaptureBusy(true);
    try {
      const preset = destinationToPreset(captureDestination);
      const result = await captureScreenshotWithScreenshotOne({
        url: captureUrl.trim(),
        preset,
        delayMs: captureDelayMs,
        ...(captureDestination === "heroImage" ? { heroFullPage: heroCaptureFullPage } : {}),
        ...(captureDestination === "coverImage" ? { coverFullPage: coverCaptureFullPage } : {}),
        ...(captureDestination === "thumbImage" ? { thumbnailFullPage: thumbCaptureFullPage } : {}),
        ...(captureDestination === "mobileImage" ? { mobileFullPage: mobileCaptureFullPage } : {}),
        ...(captureDestination === "gallery" ? { galleryFullPage: galleryCaptureFullPage } : {}),
      });
      if (!result.ok) {
        setCaptureError(result.error);
        error(result.error);
        return;
      }

      if (captureDestination === "gallery") {
        const resized = await resizeDataUrl(
          result.dataUrl,
          GALLERY_MAX_ENCODE_W,
          GALLERY_MAX_ENCODE_H,
          GALLERY_JPEG_QUALITY,
        );
        const id = `so-${Date.now()}`;
        setShots((prev) => [
          ...prev,
          { id, url: resized, caption: galleryCaptureCaption.trim(), processing: false, error: "" },
        ]);
        setGalleryCaptureCaption("");
      } else {
        const slot = SLOTS.find((s) => s.name === captureDestination);
        if (!slot) {
          const msg = "Unknown image slot.";
          setCaptureError(msg);
          error(msg);
          return;
        }
        const resized = await resizeDataUrl(
          result.dataUrl,
          slot.maxW,
          slot.maxH,
          slot.quality ?? 0.85,
        );
        setSlot(captureDestination, { url: resized });
      }

      const where = DESTINATION_LABEL[captureDestination];
      success(`Screenshot applied to ${where}. Save the form to persist.`);
    } catch (e) {
      if (isNextRedirect(e)) return;
      console.error(e);
      const msg = e instanceof Error ? e.message : "Capture failed";
      setCaptureError(msg);
      error(msg);
    } finally {
      setCaptureBusy(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* ── ScreenshotOne capture ─────────────────────────────────── */}
      <div className="rounded-lg border border-accent/20 bg-accent/5 p-4">
        <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
          <span className="text-sm font-medium text-text-primary">ScreenshotOne</span>
          <span className="font-mono text-[10px] text-text-tertiary">server-side · keys from env</span>
        </div>
        <p className="mb-3 text-[11px] leading-relaxed text-text-tertiary">
          Captures the live URL, then resizes to match each slot (same as manual upload). Use a longer delay for heavy SPAs.
        </p>
        <div className="flex flex-col gap-3">
          <div className="form-field mb-0">
            <label className="form-label" htmlFor={`${uid}-capture-url`}>Page URL</label>
            <input
              id={`${uid}-capture-url`}
              type="url"
              value={captureUrl}
              onChange={(e) => setCaptureUrl(e.target.value)}
              placeholder="https://example.com/pricing"
              className="form-input"
              autoComplete="off"
            />
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="form-field mb-0">
              <label className="form-label" htmlFor={`${uid}-capture-dest`}>Apply to</label>
              <select
                id={`${uid}-capture-dest`}
                value={captureDestination}
                onChange={(e) => setCaptureDestination(e.target.value as CaptureDestination)}
                className="form-input"
              >
                <option value="heroImage">Case study hero</option>
                <option value="coverImage">Listing cover</option>
                <option value="thumbImage">Card thumbnail</option>
                <option value="mobileImage">Mobile mockup</option>
                <option value="gallery">Gallery (append)</option>
              </select>
            </div>
            <div className="form-field mb-0">
              <label className="form-label" htmlFor={`${uid}-capture-delay`}>Delay (ms)</label>
              <input
                id={`${uid}-capture-delay`}
                type="number"
                min={0}
                max={30000}
                step={100}
                value={captureDelayMs}
                onChange={(e) => setCaptureDelayMs(Number(e.target.value) || 0)}
                className="form-input"
              />
            </div>
          </div>

          {captureDestination === "heroImage" && (
            <fieldset className="form-field mb-0 border-0 p-0">
              <legend className="form-label">Hero capture</legend>
              <div className="mt-1 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:gap-x-6 sm:gap-y-2">
                <label className="flex cursor-pointer items-center gap-2 text-sm text-text-primary">
                  <input
                    type="radio"
                    className="border-border text-accent focus:ring-accent/40"
                    name={`${uid}-hero-capture-mode`}
                    checked={heroCaptureFullPage}
                    onChange={() => setHeroCaptureFullPage(true)}
                  />
                  <span>
                    Full page <span className="font-normal text-text-tertiary">(entire scroll)</span>
                  </span>
                </label>
                <label className="flex cursor-pointer items-center gap-2 text-sm text-text-primary">
                  <input
                    type="radio"
                    className="border-border text-accent focus:ring-accent/40"
                    name={`${uid}-hero-capture-mode`}
                    checked={!heroCaptureFullPage}
                    onChange={() => setHeroCaptureFullPage(false)}
                  />
                  <span>
                    Above the fold <span className="font-normal text-text-tertiary">(one viewport)</span>
                  </span>
                </label>
              </div>
            </fieldset>
          )}

          {captureDestination === "mobileImage" && (
            <fieldset className="form-field mb-0 border-0 p-0">
              <legend className="form-label">Mobile capture</legend>
              <div className="mt-1 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:gap-x-6 sm:gap-y-2">
                <label className="flex cursor-pointer items-center gap-2 text-sm text-text-primary">
                  <input
                    type="radio"
                    className="border-border text-accent focus:ring-accent/40"
                    name={`${uid}-mobile-capture-mode`}
                    checked={mobileCaptureFullPage}
                    onChange={() => setMobileCaptureFullPage(true)}
                  />
                  <span>
                    Full page <span className="font-normal text-text-tertiary">(entire scroll)</span>
                  </span>
                </label>
                <label className="flex cursor-pointer items-center gap-2 text-sm text-text-primary">
                  <input
                    type="radio"
                    className="border-border text-accent focus:ring-accent/40"
                    name={`${uid}-mobile-capture-mode`}
                    checked={!mobileCaptureFullPage}
                    onChange={() => setMobileCaptureFullPage(false)}
                  />
                  <span>
                    Above the fold <span className="font-normal text-text-tertiary">(one viewport)</span>
                  </span>
                </label>
              </div>
            </fieldset>
          )}

          {captureDestination === "coverImage" && (
            <fieldset className="form-field mb-0 border-0 p-0">
              <legend className="form-label">Listing cover capture</legend>
              <p className="mb-2 text-[10px] leading-relaxed text-text-tertiary">
                Larger /work card art — full page shows the whole scroll; above the fold is one 1440×810 viewport.
              </p>
              <div className="mt-1 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:gap-x-6 sm:gap-y-2">
                <label className="flex cursor-pointer items-center gap-2 text-sm text-text-primary">
                  <input
                    type="radio"
                    className="border-border text-accent focus:ring-accent/40"
                    name={`${uid}-cover-capture-mode`}
                    checked={coverCaptureFullPage}
                    onChange={() => setCoverCaptureFullPage(true)}
                  />
                  <span>
                    Full page <span className="font-normal text-text-tertiary">(entire scroll)</span>
                  </span>
                </label>
                <label className="flex cursor-pointer items-center gap-2 text-sm text-text-primary">
                  <input
                    type="radio"
                    className="border-border text-accent focus:ring-accent/40"
                    name={`${uid}-cover-capture-mode`}
                    checked={!coverCaptureFullPage}
                    onChange={() => setCoverCaptureFullPage(false)}
                  />
                  <span>
                    Above the fold <span className="font-normal text-text-tertiary">(one viewport)</span>
                  </span>
                </label>
              </div>
            </fieldset>
          )}

          {captureDestination === "thumbImage" && (
            <fieldset className="form-field mb-0 border-0 p-0">
              <legend className="form-label">Card thumbnail capture</legend>
              <p className="mb-2 text-[10px] leading-relaxed text-text-tertiary">
                Small homepage cards usually look best above the fold; turn on full page if you want the whole page scaled into 1280×720.
              </p>
              <div className="mt-1 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:gap-x-6 sm:gap-y-2">
                <label className="flex cursor-pointer items-center gap-2 text-sm text-text-primary">
                  <input
                    type="radio"
                    className="border-border text-accent focus:ring-accent/40"
                    name={`${uid}-thumb-capture-mode`}
                    checked={!thumbCaptureFullPage}
                    onChange={() => setThumbCaptureFullPage(false)}
                  />
                  <span>
                    Above the fold <span className="font-normal text-text-tertiary">(one viewport)</span>
                  </span>
                </label>
                <label className="flex cursor-pointer items-center gap-2 text-sm text-text-primary">
                  <input
                    type="radio"
                    className="border-border text-accent focus:ring-accent/40"
                    name={`${uid}-thumb-capture-mode`}
                    checked={thumbCaptureFullPage}
                    onChange={() => setThumbCaptureFullPage(true)}
                  />
                  <span>
                    Full page <span className="font-normal text-text-tertiary">(entire scroll)</span>
                  </span>
                </label>
              </div>
            </fieldset>
          )}

          {captureDestination === "gallery" && (
            <fieldset className="form-field mb-0 border-0 p-0">
              <legend className="form-label">Gallery capture</legend>
              <p className="mb-2 text-[10px] leading-relaxed text-text-tertiary">
                Case study lightbox — above the fold is one 1440×900 viewport; full page captures the whole scroll (then resized for storage).
              </p>
              <div className="mt-1 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:gap-x-6 sm:gap-y-2">
                <label className="flex cursor-pointer items-center gap-2 text-sm text-text-primary">
                  <input
                    type="radio"
                    className="border-border text-accent focus:ring-accent/40"
                    name={`${uid}-gallery-capture-mode`}
                    checked={!galleryCaptureFullPage}
                    onChange={() => setGalleryCaptureFullPage(false)}
                  />
                  <span>
                    Above the fold <span className="font-normal text-text-tertiary">(one viewport)</span>
                  </span>
                </label>
                <label className="flex cursor-pointer items-center gap-2 text-sm text-text-primary">
                  <input
                    type="radio"
                    className="border-border text-accent focus:ring-accent/40"
                    name={`${uid}-gallery-capture-mode`}
                    checked={galleryCaptureFullPage}
                    onChange={() => setGalleryCaptureFullPage(true)}
                  />
                  <span>
                    Full page <span className="font-normal text-text-tertiary">(entire scroll)</span>
                  </span>
                </label>
              </div>
            </fieldset>
          )}

          {captureDestination === "gallery" && (
            <div className="form-field mb-0">
              <label className="form-label" htmlFor={`${uid}-gallery-cap`}>Gallery caption (optional)</label>
              <input
                id={`${uid}-gallery-cap`}
                type="text"
                value={galleryCaptureCaption}
                onChange={(e) => setGalleryCaptureCaption(e.target.value)}
                placeholder="e.g. Checkout flow"
                className="form-input"
              />
            </div>
          )}
          {captureError && <p className="text-xs text-red-400">{captureError}</p>}
          <button
            type="button"
            disabled={captureBusy || !captureUrl.trim()}
            onClick={runScreenshotOneCapture}
            className="btn btn-secondary w-fit text-sm disabled:opacity-50"
          >
            {captureBusy ? "Capturing…" : "Capture & apply"}
          </button>
        </div>
      </div>

      {SLOTS.map(slot => {
        const st = states[slot.name];
        return (
          <div key={slot.name} className="flex flex-col gap-2">
            {/* Label row */}
            <div className="flex items-baseline justify-between gap-4">
              <label className="form-label mb-0">{slot.label}</label>
              <span className="font-mono text-[11px] text-text-tertiary whitespace-nowrap">
                {slot.idealDims} &middot; {slot.aspect}
              </span>
            </div>

            {/* Hidden field submitted with form */}
            <input type="hidden" name={slot.name} value={st.url} />

            <div className="flex items-start gap-4">
              {/* Preview box — always visible, shows placeholder when empty */}
              {st.url ? (
                <button
                  type="button"
                  className="shrink-0 cursor-zoom-in overflow-hidden rounded-md border border-border bg-surface text-left transition-colors hover:border-accent/45 focus:border-accent/50 focus:outline-none focus:ring-2 focus:ring-accent/30"
                  style={{ width: slot.previewW, height: slot.previewH }}
                  onClick={() => setImagePreview({ src: st.url, label: slot.label })}
                  aria-label={`Open full preview: ${slot.label}`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={st.url} alt="" className="pointer-events-none h-full w-full object-cover" />
                </button>
              ) : (
                <div
                  className="shrink-0 overflow-hidden rounded-md border border-border bg-surface"
                  style={{ width: slot.previewW, height: slot.previewH }}
                >
                  <div className="flex h-full w-full flex-col items-center justify-center gap-1 text-text-tertiary">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                      <rect x="3" y="3" width="18" height="18" rx="2" />
                      <circle cx="8.5" cy="8.5" r="1.5" />
                      <path d="M21 15l-5-5L5 21" />
                    </svg>
                    <span className="text-[10px] tracking-wide">{slot.aspect}</span>
                  </div>
                </div>
              )}

              {/* Controls */}
              <div className="flex flex-col gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => fileRefs.current[slot.name]?.click()}
                  disabled={st.processing}
                  className="rounded border border-border px-3 py-1.5 text-sm text-text-primary transition-colors hover:border-accent/50 hover:text-accent disabled:opacity-50"
                >
                  {st.processing ? "Processing…" : st.url ? "Replace" : "Upload"}
                </button>

                {st.url && !st.processing && (
                  <button
                    type="button"
                    onClick={() => setSlot(slot.name, { url: "" })}
                    className="text-xs text-text-tertiary transition-colors hover:text-red-400"
                  >
                    Remove
                  </button>
                )}

                <p className="text-[11px] leading-relaxed text-text-tertiary">
                  {slot.displayCtx}
                </p>
                <p className="text-[11px] text-text-tertiary/60">
                  Any format · saved as JPEG, capped at {slot.maxW} × {slot.maxH} px
                </p>

                {st.error && <p className="text-xs text-red-400">{st.error}</p>}
              </div>
            </div>

            <input
              ref={el => { fileRefs.current[slot.name] = el; }}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={e => handleFile(slot, e)}
            />
          </div>
        );
      })}

      {/* ── Screenshots gallery section ─────────────────────────────── */}
      <div className="flex flex-col gap-3 border-t border-border pt-6">
        <div className="flex items-baseline justify-between gap-4">
          <span className="form-label mb-0">Gallery screenshots</span>
          <span className="font-mono text-[11px] text-text-tertiary">
            saved up to {GALLERY_MAX_ENCODE_W} × {GALLERY_MAX_ENCODE_H} px · high quality JPEG
          </span>
        </div>
        <p className="text-[11px] leading-relaxed text-text-tertiary">
          Additional pages shown below the hero (inner pages, dashboards, admin views). Upload multiple at once — drag to reorder.
        </p>

        {/* Hidden JSON field */}
        <input type="hidden" name="screenshots" value={screenshotsJson} />

        {/* Existing shots */}
        {shots.length > 0 && (
          <div className="flex flex-col gap-3">
            {shots.map((shot, idx) => (
              <div key={shot.id} className="flex items-start gap-3 rounded-lg border border-border bg-surface p-3">
                {/* Thumbnail */}
                <div className="shrink-0 overflow-hidden rounded border border-border bg-[#111]" style={{ width: 128, height: 72 }}>
                  {shot.processing ? (
                    <div className="flex h-full w-full items-center justify-center text-[10px] text-text-tertiary">Processing…</div>
                  ) : shot.url ? (
                    <button
                      type="button"
                      className="flex h-full w-full cursor-zoom-in overflow-hidden rounded text-left transition-[box-shadow] hover:shadow-[inset_0_0_0_2px_rgba(255,255,255,0.12)] focus:outline-none focus:ring-2 focus:ring-accent/40"
                      onClick={() =>
                        setImagePreview({
                          src: shot.url,
                          label: shot.caption.trim() || `Gallery screenshot ${idx + 1}`,
                        })
                      }
                      aria-label={`Open full preview: ${shot.caption.trim() || `Screenshot ${idx + 1}`}`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={shot.url} alt="" className="pointer-events-none h-full w-full object-cover" />
                    </button>
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-[10px] text-red-400">{shot.error || "Error"}</div>
                  )}
                </div>

                {/* Caption + controls */}
                <div className="flex flex-1 flex-col gap-2">
                  <input
                    type="text"
                    placeholder="Caption (optional)"
                    value={shot.caption}
                    onChange={e => updateCaption(shot.id, e.target.value)}
                    id={`${uid}-caption-${shot.id}`}
                    className="rounded border border-border bg-transparent px-2 py-1 text-sm text-text-primary placeholder:text-text-tertiary/50 focus:border-accent/50 focus:outline-none"
                  />
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => moveShot(shot.id, -1)}
                      className="text-[11px] text-text-tertiary transition-colors hover:text-text-primary disabled:opacity-30"
                      aria-label="Move up"
                    >↑ Up</button>
                    <button
                      type="button"
                      disabled={idx === shots.length - 1}
                      onClick={() => moveShot(shot.id, 1)}
                      className="text-[11px] text-text-tertiary transition-colors hover:text-text-primary disabled:opacity-30"
                      aria-label="Move down"
                    >↓ Down</button>
                    <button
                      type="button"
                      onClick={() => removeShot(shot.id)}
                      className="text-[11px] text-text-tertiary transition-colors hover:text-red-400"
                    >Remove</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {addError && <p className="text-xs text-red-400">{addError}</p>}

        <button
          type="button"
          onClick={() => screenshotFileRef.current?.click()}
          className="self-start rounded border border-border px-3 py-1.5 text-sm text-text-primary transition-colors hover:border-accent/50 hover:text-accent"
        >
          + Add screenshots
        </button>
        <input
          ref={screenshotFileRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handleScreenshotFiles}
        />
      </div>

      {imagePreview && (
        <div className="fixed inset-0 z-[240] flex items-center justify-center p-4 sm:p-8">
          <button
            type="button"
            className="absolute inset-0 bg-black/85 backdrop-blur-[2px]"
            aria-label="Close preview"
            onClick={() => setImagePreview(null)}
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={`${uid}-preview-title`}
            className="relative z-[1] flex max-h-[min(92vh,1200px)] w-full max-w-[min(1200px,calc(100vw-2rem))] flex-col overflow-hidden rounded-xl border border-border bg-surface shadow-2xl"
          >
            <div className="flex shrink-0 items-center justify-between gap-3 border-b border-border px-4 py-3">
              <p id={`${uid}-preview-title`} className="truncate text-sm font-medium text-text-primary">
                {imagePreview.label}
              </p>
              <button
                type="button"
                onClick={() => setImagePreview(null)}
                className="shrink-0 rounded border border-border px-3 py-1.5 text-xs text-text-primary transition-colors hover:border-accent/50 hover:text-accent"
              >
                Close
              </button>
            </div>
            <div className="min-h-0 flex-1 overflow-auto p-3 sm:p-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imagePreview.src}
                alt={imagePreview.label}
                className="mx-auto block h-auto max-h-[calc(92vh-5.5rem)] w-full max-w-full object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
