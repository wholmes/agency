"use client";

import { useRef, useState } from "react";

interface Props {
  currentUrl?: string;
}

// Resize + compress to JPEG in the browser — no upload service needed
function processImage(file: File, maxDim = 300, quality = 0.88): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    img.onload = () => {
      const scale = Math.min(1, maxDim / Math.max(img.width, img.height));
      const w = Math.round(img.width * scale);
      const h = Math.round(img.height * scale);
      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      canvas.getContext("2d")!.drawImage(img, 0, 0, w, h);
      URL.revokeObjectURL(img.src);
      resolve(canvas.toDataURL("image/jpeg", quality));
    };
    img.onerror = () => {
      URL.revokeObjectURL(img.src);
      reject(new Error("Could not read image"));
    };
    img.src = URL.createObjectURL(file);
  });
}

export default function PhotoUpload({ currentUrl = "" }: Props) {
  const [url, setUrl]             = useState(currentUrl);
  const [processing, setProcessing] = useState(false);
  const [error, setError]         = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please choose an image file.");
      return;
    }

    setProcessing(true);
    setError("");

    try {
      const dataUrl = await processImage(file);
      setUrl(dataUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not process image");
    } finally {
      setProcessing(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  return (
    <div>
      {/* Submitted with the parent server action as the photoUrl field */}
      <input type="hidden" name="photoUrl" value={url} />

      {/* Preview */}
      {url && (
        <div className="mb-3 h-16 w-16 overflow-hidden rounded-full ring-1 ring-border">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={url} alt="Headshot preview" className="h-full w-full object-cover" />
        </div>
      )}

      {/* Controls */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={processing}
          className="rounded border border-border px-3 py-1.5 text-sm text-text-primary transition-colors hover:border-accent-muted hover:text-accent disabled:opacity-50"
        >
          {processing ? "Processing…" : url ? "Replace photo" : "Upload photo"}
        </button>

        {url && !processing && (
          <button
            type="button"
            onClick={() => setUrl("")}
            className="text-xs text-text-tertiary transition-colors hover:text-error"
          >
            Remove
          </button>
        )}
      </div>

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFile}
      />

      {error && <p className="mt-1.5 text-xs text-error">{error}</p>}

      <p className="mt-1.5 text-xs text-text-tertiary">
        Any image format · Resized &amp; compressed automatically · Leave blank to show initials.
      </p>
    </div>
  );
}
