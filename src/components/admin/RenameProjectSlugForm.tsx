"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { renameProjectSlug } from "@/lib/admin/rename-project-slug";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="btn btn-secondary text-sm" disabled={pending}>
      {pending ? "Renaming…" : "Change URL"}
    </button>
  );
}

type Props = { currentId: string; currentUrl: string };

export default function RenameProjectSlugForm({ currentId, currentUrl }: Props) {
  const [state, action] = useActionState(renameProjectSlug, null);

  return (
    <div className="rounded-lg border border-border p-5">
      <h2 className="mb-1 font-display text-lg font-light tracking-tight">URL slug</h2>
      <p className="mb-4 text-[11px] text-text-tertiary leading-relaxed">
        Public case study path: <span className="font-mono text-text-secondary">{currentUrl}</span>
      </p>

      {state?.error && (
        <p className="mb-4 rounded-md border border-red-700/40 bg-red-950/30 px-3 py-2 text-sm text-red-300" role="alert">
          {state.error}
        </p>
      )}

      <form action={action} className="flex flex-col gap-4">
        <input type="hidden" name="currentId" value={currentId} />

        <div className="form-field">
          <label className="form-label" htmlFor="newProjectId">
            New URL slug
          </label>
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-2">
            <span className="shrink-0 font-mono text-xs text-text-tertiary">/work/</span>
            <input
              id="newProjectId"
              name="newId"
              type="text"
              required
              autoComplete="off"
              className="form-input flex-1 font-mono text-sm"
              defaultValue={currentId}
              placeholder="new-case-study-slug"
            />
          </div>
          <p className="mt-1 text-xs text-text-tertiary">
            Lowercase letters, numbers, and hyphens. You will be moved to the new admin URL after save.
          </p>
        </div>

        <label className="flex cursor-pointer items-start gap-3 text-sm text-text-secondary">
          <input type="checkbox" name="addRedirect" defaultChecked className="mt-0.5" />
          <span>
            Add a <strong className="font-medium text-text-primary">permanent redirect</strong> from the old URL
            to the new one (recommended for links and search engines).
          </span>
        </label>

        <div>
          <SubmitButton />
        </div>
      </form>
    </div>
  );
}
