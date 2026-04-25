"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { uploadBlogImageToS3 } from "@/lib/admin/blog-s3-upload";
import { useAdminToast } from "@/components/admin/AdminToast";

type Mode = "url" | "upload";

function looksLikeHttpUrl(s: string): boolean {
  const t = s.trim().toLowerCase();
  return t.startsWith("https://") || t.startsWith("http://");
}

export default function BlogCoverImageField({ defaultValue = "" }: { defaultValue?: string }) {
  const uid = useId();
  const { success, error } = useAdminToast();
  const fileRef = useRef<HTMLInputElement>(null);
  const [mode, setMode] = useState<Mode>("url");
  const [coverUrl, setCoverUrl] = useState(defaultValue.trim());
  const [busy, setBusy] = useState(false);
  const [previewError, setPreviewError] = useState(false);

  useEffect(() => {
    setPreviewError(false);
  }, [coverUrl]);

  const onFile = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      e.target.value = "";
      if (!file) return;
      setBusy(true);
      try {
        const fd = new FormData();
        fd.set("file", file);
        const res = await uploadBlogImageToS3(fd);
        if (!res.ok) {
          error(res.error);
          return;
        }
        setCoverUrl(res.url);
        success("Cover image uploaded to S3.");
      } finally {
        setBusy(false);
      }
    },
    [error, success],
  );

  const showPreview = coverUrl.trim().length > 0 && looksLikeHttpUrl(coverUrl);

  return (
    <div className="form-field mb-0">
      <span className="form-label">Cover image</span>
      <p className="mb-2 text-[11px] leading-relaxed text-text-tertiary">
        Use a direct image URL (any host), or upload to your Amazon S3 bucket when env vars are set.
      </p>

      <div className="mb-3 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setMode("url")}
          className={`rounded-md border px-3 py-1.5 text-xs font-medium transition-colors ${
            mode === "url"
              ? "border-accent/50 bg-accent/10 text-accent"
              : "border-border text-text-tertiary hover:border-border hover:text-text-secondary"
          }`}
        >
          Image URL
        </button>
        <button
          type="button"
          onClick={() => setMode("upload")}
          className={`rounded-md border px-3 py-1.5 text-xs font-medium transition-colors ${
            mode === "upload"
              ? "border-accent/50 bg-accent/10 text-accent"
              : "border-border text-text-tertiary hover:border-border hover:text-text-secondary"
          }`}
        >
          Upload to Amazon S3
        </button>
        {coverUrl.trim() && (
          <button
            type="button"
            onClick={() => setCoverUrl("")}
            className="ml-auto rounded-md border border-error/40 px-3 py-1.5 text-xs font-medium text-error/70 transition-colors hover:border-error hover:text-error"
          >
            Clear image
          </button>
        )}
      </div>

      <input type="hidden" name="coverImage" value={coverUrl} readOnly />

      {mode === "url" ? (
        <input
          id={`${uid}-cover-url`}
          type="url"
          value={coverUrl}
          onChange={(e) => setCoverUrl(e.target.value)}
          placeholder="https://cdn.example.com/cover.jpg"
          className="form-input"
          autoComplete="off"
        />
      ) : (
        <div className="flex flex-col gap-2">
          <input
            ref={fileRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="hidden"
            onChange={onFile}
          />
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              disabled={busy}
              onClick={() => fileRef.current?.click()}
              className="btn btn-secondary text-sm disabled:opacity-50"
            >
              {busy ? "Uploading…" : "Choose image file"}
            </button>
            {coverUrl ? (
              <span className="font-mono text-[10px] text-text-tertiary break-all">
                Saved URL is submitted with the form.
              </span>
            ) : (
              <span className="text-xs text-text-tertiary">JPEG, PNG, WebP, or GIF — max 10 MB.</span>
            )}
          </div>
        </div>
      )}

      {showPreview && !previewError && (
        <div className="mt-3 overflow-hidden rounded-md border border-border bg-surface/20">
          <p className="border-b border-border px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest text-text-tertiary">
            Image preview
          </p>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={coverUrl.trim()}
            alt=""
            className="max-h-48 w-full object-cover object-center"
            onError={() => setPreviewError(true)}
          />
        </div>
      )}
      {showPreview && previewError && (
        <p className="mt-2 text-xs text-text-tertiary">
          Preview could not load. Check the URL, CORS, or S3 bucket public read policy.
        </p>
      )}
    </div>
  );
}
