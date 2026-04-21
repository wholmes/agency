"use client";

import { useRef, useState } from "react";

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
}

const SLOTS: ImageSlot[] = [
  {
    name: "thumbImage",
    label: "Card thumbnail",
    idealDims: "1280 × 720 px",
    displayCtx: "Homepage cards · renders ~500 px wide · taller than 16:9 clips from bottom",
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
    displayCtx: "/work page cards · renders ~620 px wide · taller than 16:9 clips from bottom",
    aspect: "16 : 9",
    previewW: 192,
    previewH: 108,
    maxW: 1440,
    maxH: 810,
  },
  {
    name: "heroImage",
    label: "Case study hero",
    idealDims: "2200 × 1238 px",
    displayCtx: "Detail page browser window · renders up to 1024 px wide · taller than 16:9 clips from bottom",
    aspect: "16 : 9",
    previewW: 256,
    previewH: 144,
    maxW: 2200,
    maxH: 1238,
  },
  {
    name: "mobileImage",
    label: "Mobile screenshot",
    idealDims: "780 × 1688 px",
    displayCtx: "Phone mockup on detail page · renders ~280 px wide · portrait, clips from bottom if taller than 9:19.5",
    aspect: "9 : 19.5",
    previewW: 72,
    previewH: 156,
    maxW: 780,
    maxH: 1688,
  },
];

function processImage(file: File, maxW: number, maxH: number, quality = 0.88): Promise<string> {
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

interface SlotState {
  url: string;
  processing: boolean;
  error: string;
}

interface Props {
  thumbImage?: string;
  coverImage?: string;
  heroImage?: string;
  mobileImage?: string;
}

export default function CaseStudyImageUpload({ thumbImage = "", coverImage = "", heroImage = "", mobileImage = "" }: Props) {
  const defaults: Record<string, string> = { thumbImage, coverImage, heroImage, mobileImage };

  const [states, setStates] = useState<Record<string, SlotState>>(() =>
    Object.fromEntries(SLOTS.map(s => [s.name, { url: defaults[s.name] ?? "", processing: false, error: "" }]))
  );

  const fileRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const setSlot = (name: string, patch: Partial<SlotState>) =>
    setStates(prev => ({ ...prev, [name]: { ...prev[name], ...patch } }));

  const handleFile = async (slot: ImageSlot, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) { setSlot(slot.name, { error: "Please choose an image file." }); return; }
    setSlot(slot.name, { processing: true, error: "" });
    try {
      const dataUrl = await processImage(file, slot.maxW, slot.maxH);
      setSlot(slot.name, { url: dataUrl, processing: false });
    } catch (err) {
      setSlot(slot.name, { processing: false, error: err instanceof Error ? err.message : "Could not process image" });
    } finally {
      const ref = fileRefs.current[slot.name];
      if (ref) ref.value = "";
    }
  };

  return (
    <div className="flex flex-col gap-6">
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
              <div
                className="shrink-0 overflow-hidden rounded-md border border-border bg-surface"
                style={{ width: slot.previewW, height: slot.previewH }}
              >
                {st.url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={st.url} alt={`${slot.label} preview`} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full flex-col items-center justify-center gap-1 text-text-tertiary">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                      <rect x="3" y="3" width="18" height="18" rx="2" />
                      <circle cx="8.5" cy="8.5" r="1.5" />
                      <path d="M21 15l-5-5L5 21" />
                    </svg>
                    <span className="text-[10px] tracking-wide">{slot.aspect}</span>
                  </div>
                )}
              </div>

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
    </div>
  );
}
