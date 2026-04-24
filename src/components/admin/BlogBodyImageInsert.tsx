"use client";

import { useCallback, useId, useRef, useState } from "react";
import { uploadBlogImageToS3 } from "@/lib/admin/blog-s3-upload";
import { useAdminToast } from "@/components/admin/AdminToast";

const BODY_TEXTAREA_ID = "body";

/**
 * Uploads to S3 and appends a Markdown image line to the article body textarea (`#body`).
 */
export default function BlogBodyImageInsert() {
  const uid = useId();
  const fileRef = useRef<HTMLInputElement>(null);
  const { success, error } = useAdminToast();
  const [busy, setBusy] = useState(false);
  const [lastUploadedUrl, setLastUploadedUrl] = useState<string | null>(null);
  const [previewError, setPreviewError] = useState(false);

  const appendMarkdown = useCallback((url: string) => {
    const ta = document.getElementById(BODY_TEXTAREA_ID) as HTMLTextAreaElement | null;
    if (!ta) {
      error("Could not find the article body field.");
      return;
    }
    const line = `\n\n![Image](${url})\n\n`;
    const start = ta.selectionStart ?? ta.value.length;
    const end = ta.selectionEnd ?? ta.value.length;
    const next = ta.value.slice(0, start) + line + ta.value.slice(end);
    ta.value = next;
    const caret = start + line.length;
    ta.focus();
    ta.setSelectionRange(caret, caret);
    ta.dispatchEvent(new Event("input", { bubbles: true }));
    setLastUploadedUrl(url);
    setPreviewError(false);
    success("Image Markdown inserted in the body.");
  }, [error, success]);

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
        appendMarkdown(res.url);
      } finally {
        setBusy(false);
      }
    },
    [appendMarkdown, error],
  );

  return (
    <div className="rounded-md border border-border/80 bg-surface/30 px-3 py-2.5">
      <p className="mb-2 text-[11px] font-medium text-text-primary">Inline images (Markdown)</p>
      <p className="mb-2 text-[10px] leading-relaxed text-text-tertiary">
        Upload inserts <span className="font-mono">![Image](url)</span> at the cursor (or at the end). You can also paste any image URL directly in the body.
      </p>
      <input ref={fileRef} id={`${uid}-body-img`} type="file" accept="image/jpeg,image/png,image/webp,image/gif" className="hidden" onChange={onFile} />
      <button
        type="button"
        disabled={busy}
        onClick={() => fileRef.current?.click()}
        className="btn btn-secondary text-xs disabled:opacity-50"
      >
        {busy ? "Uploading…" : "Upload to S3 & insert in body"}
      </button>

      {lastUploadedUrl && !previewError && (
        <div className="mt-3 flex flex-wrap items-start gap-3 rounded-md border border-border bg-surface/20 p-2">
          <p className="w-full font-mono text-[10px] uppercase tracking-widest text-text-tertiary">
            S3 image preview
          </p>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={lastUploadedUrl}
            alt=""
            className="h-20 w-20 shrink-0 rounded border border-border object-cover"
            onError={() => setPreviewError(true)}
          />
          <div className="min-w-0 flex-1">
            <p className="mb-2 break-all font-mono text-[10px] text-text-tertiary">{lastUploadedUrl}</p>
            <button
              type="button"
              onClick={() => setLastUploadedUrl(null)}
              className="text-[11px] text-accent no-underline hover:underline"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}
      {lastUploadedUrl && previewError && (
        <p className="mt-2 text-xs text-text-tertiary">
          Uploaded, but preview failed to load (check bucket policy / URL). Markdown was still inserted.
        </p>
      )}
    </div>
  );
}
