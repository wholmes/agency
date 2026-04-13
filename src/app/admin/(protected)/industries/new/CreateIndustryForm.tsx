"use client";

import { useActionState } from "react";
import Link from "next/link";
import { createIndustryPage, type CreateIndustryState } from "@/lib/admin/mutations-data";

export default function CreateIndustryForm() {
  const [state, formAction, pending] = useActionState(createIndustryPage, null as CreateIndustryState);

  return (
    <form action={formAction} className="flex max-w-xl flex-col gap-5">
      <div className="form-field">
        <label className="form-label" htmlFor="slug">
          URL slug
        </label>
        <input
          id="slug"
          name="slug"
          type="text"
          required
          autoComplete="off"
          placeholder="e.g. life-science or startups"
          className={`form-input font-mono text-sm${state?.error ? " error" : ""}`}
        />
        <p className="mt-1 text-xs text-text-tertiary">
          Public URL: <span className="font-mono">/industries/[slug]</span> — lowercase, hyphens only. You can paste a title and fix the slug.
        </p>
      </div>
      <div className="form-field">
        <label className="form-label" htmlFor="listTitle">
          List title
        </label>
        <input
          id="listTitle"
          name="listTitle"
          type="text"
          required
          placeholder="e.g. Life science"
          className="form-input"
        />
        <p className="mt-1 text-xs text-text-tertiary">Shown on the /industries hub card and in the admin list.</p>
      </div>
      <div className="form-field">
        <label className="form-label" htmlFor="listBlurb">
          List blurb{" "}
          <span className="font-normal text-text-tertiary">(optional)</span>
        </label>
        <textarea
          id="listBlurb"
          name="listBlurb"
          rows={3}
          placeholder="One line for the hub card. Leave blank to use a generic placeholder."
          className="form-input"
        />
      </div>
      {state?.error ? (
        <p className="form-error" role="alert">
          {state.error}
        </p>
      ) : null}
      <div className="flex flex-wrap items-center gap-3">
        <button type="submit" className="btn btn-primary" disabled={pending}>
          {pending ? "Creating…" : "Create & edit"}
        </button>
        <Link href="/admin/industries" className="text-sm text-text-tertiary no-underline hover:text-text-secondary">
          Cancel
        </Link>
      </div>
      <p className="text-xs text-text-tertiary">
        After creation you&apos;ll land on the full editor. Hero, SEO, and body fields are filled with placeholders—replace them when you&apos;re ready.
      </p>
    </form>
  );
}
