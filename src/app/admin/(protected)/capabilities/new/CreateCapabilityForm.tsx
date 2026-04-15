"use client";

import { useActionState } from "react";
import { createCapability } from "@/lib/admin/mutations-data";

export default function CreateCapabilityForm() {
  const [state, action, pending] = useActionState(createCapability, null);

  return (
    <form action={action} className="flex flex-col gap-5">
      {state?.error && (
        <p className="rounded border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-400">
          {state.error}
        </p>
      )}

      <div className="form-field">
        <label className="form-label" htmlFor="title">Title</label>
        <input id="title" name="title" type="text" required className="form-input" placeholder="e.g. Custom CMS" />
      </div>

      <div className="form-field">
        <label className="form-label" htmlFor="descriptor">Descriptor</label>
        <textarea id="descriptor" name="descriptor" rows={3} className="form-input" placeholder="Short marketing copy shown on the card" />
      </div>

      <div className="form-field">
        <label className="form-label" htmlFor="detail">Detail (fine print)</label>
        <textarea id="detail" name="detail" rows={3} className="form-input" placeholder="The smaller detail text at the bottom of the card" />
      </div>

      <div className="form-field">
        <label className="form-label" htmlFor="tags">Tags</label>
        <input id="tags" name="tags" type="text" className="form-input" placeholder="Comma-separated e.g. Next.js, React, Stripe" />
        <p className="mt-1 text-xs text-text-tertiary">Separate with commas. Aim for 6 tags.</p>
      </div>

      <div className="form-field">
        <label className="form-label" htmlFor="iconSvg">Icon SVG</label>
        <textarea
          id="iconSvg"
          name="iconSvg"
          rows={6}
          className="form-input font-mono text-xs"
          placeholder={`<svg width="38" height="38" viewBox="0 0 24 24" fill="none" aria-hidden="true">\n  <path d="..." stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>\n</svg>`}
        />
        <p className="mt-1 text-xs text-text-tertiary">
          Paste raw SVG. Use <code className="rounded bg-surface-2 px-1">currentColor</code> for stroke/fill — the icon inherits the card&apos;s accent colour. 24×24 viewBox, 1.5px stroke.
        </p>
      </div>

      <div className="form-field flex items-center gap-3">
        <input id="showTags" name="showTags" type="checkbox" defaultChecked className="size-4 rounded border-border accent-accent" />
        <label htmlFor="showTags" className="text-sm text-text-primary">Show tags</label>
      </div>

      <div className="form-field flex items-center gap-3">
        <input id="published" name="published" type="checkbox" defaultChecked className="size-4 rounded border-border accent-accent" />
        <label htmlFor="published" className="text-sm text-text-primary">Published</label>
      </div>

      <button type="submit" disabled={pending} className="btn btn-primary w-fit">
        {pending ? "Creating…" : "Create card"}
      </button>
    </form>
  );
}
