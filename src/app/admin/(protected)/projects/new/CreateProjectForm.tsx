"use client";

import { useActionState } from "react";
import { createProject } from "@/lib/admin/mutations-data";

export default function CreateProjectForm() {
  const [state, action, pending] = useActionState(createProject, null);

  return (
    <form action={action} className="flex flex-col gap-5">
      {state?.error && (
        <p className="rounded-md border border-red-700/40 bg-red-950/30 px-4 py-3 text-sm text-red-300" role="alert">
          {state.error}
        </p>
      )}

      {/* Identity */}
      <fieldset className="rounded-lg border border-border p-5">
        <legend className="px-2 text-xs font-semibold uppercase tracking-wider text-text-tertiary">
          Identity
        </legend>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="form-field sm:col-span-2">
            <label className="form-label" htmlFor="title">
              Title <span className="text-accent" aria-hidden="true">*</span>
            </label>
            <input
              id="title"
              name="title"
              type="text"
              required
              className="form-input"
              placeholder="Meridian SaaS"
            />
          </div>
          <div className="form-field">
            <label className="form-label" htmlFor="id">
              URL slug (ID) <span className="text-accent" aria-hidden="true">*</span>
            </label>
            <input
              id="id"
              name="id"
              type="text"
              required
              className="form-input font-mono text-sm"
              placeholder="meridian-saas"
            />
            <p className="mt-1 text-xs text-text-tertiary">
              Lowercase letters, numbers, hyphens only. Becomes <code className="font-mono">/work/[id]</code>.
            </p>
          </div>
          <div className="form-field">
            <label className="form-label" htmlFor="category">
              Category
            </label>
            <input
              id="category"
              name="category"
              type="text"
              className="form-input"
              placeholder="SaaS / B2B"
            />
          </div>
          <div className="form-field">
            <label className="form-label" htmlFor="year">
              Year
            </label>
            <input
              id="year"
              name="year"
              type="text"
              className="form-input"
              placeholder={new Date().getFullYear().toString()}
            />
          </div>
          <div className="form-field">
            <label className="form-label" htmlFor="proofFit">
              Proof line
            </label>
            <input
              id="proofFit"
              name="proofFit"
              type="text"
              className="form-input"
              placeholder="B2B SaaS · Series A · 40% faster activation"
            />
            <p className="mt-1 text-xs text-text-tertiary">
              One-liner shown on the homepage card.
            </p>
          </div>
        </div>
      </fieldset>

      {/* Result */}
      <fieldset className="rounded-lg border border-border p-5">
        <legend className="px-2 text-xs font-semibold uppercase tracking-wider text-text-tertiary">
          Result
        </legend>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="form-field">
            <label className="form-label" htmlFor="result">
              Result headline
            </label>
            <input
              id="result"
              name="result"
              type="text"
              className="form-input"
              placeholder="40% faster activation"
            />
          </div>
          <div className="form-field">
            <label className="form-label" htmlFor="resultDetail">
              Result detail
            </label>
            <input
              id="resultDetail"
              name="resultDetail"
              type="text"
              className="form-input"
              placeholder="within 3 months of launch"
            />
          </div>
        </div>
      </fieldset>

      {/* Narrative */}
      <fieldset className="rounded-lg border border-border p-5">
        <legend className="px-2 text-xs font-semibold uppercase tracking-wider text-text-tertiary">
          Narrative
        </legend>
        <div className="mt-4 flex flex-col gap-4">
          <div className="form-field">
            <label className="form-label" htmlFor="problem">
              Problem
            </label>
            <textarea id="problem" name="problem" rows={3} className="form-input" placeholder="What challenge did the client face?" />
          </div>
          <div className="form-field">
            <label className="form-label" htmlFor="approach">
              Approach
            </label>
            <textarea id="approach" name="approach" rows={3} className="form-input" placeholder="How did you solve it?" />
          </div>
          <div className="form-field">
            <label className="form-label" htmlFor="outcome">
              Outcome
            </label>
            <textarea id="outcome" name="outcome" rows={3} className="form-input" placeholder="What was the measurable result?" />
          </div>
        </div>
      </fieldset>

      {/* Visual */}
      <fieldset className="rounded-lg border border-border p-5">
        <legend className="px-2 text-xs font-semibold uppercase tracking-wider text-text-tertiary">
          Visual
        </legend>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="form-field">
            <label className="form-label" htmlFor="color">
              Hero color (hex)
            </label>
            <input
              id="color"
              name="color"
              type="text"
              className="form-input font-mono"
              defaultValue="#1a1a18"
              placeholder="#1a1a18"
            />
          </div>
          <div className="form-field">
            <label className="form-label" htmlFor="accent">
              Accent (hex)
            </label>
            <input
              id="accent"
              name="accent"
              type="text"
              className="form-input font-mono"
              defaultValue="#c9a55a"
              placeholder="#c9a55a"
            />
          </div>
        </div>
      </fieldset>

      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={pending}
          aria-busy={pending}
          className="btn btn-primary w-fit disabled:opacity-60"
        >
          {pending ? "Creating…" : "Create case study"}
        </button>
        <a href="/admin/projects" className="text-sm text-text-tertiary hover:text-text-secondary">
          Cancel
        </a>
      </div>
    </form>
  );
}
