"use client";

import { useActionState } from "react";
import {
  updateContactFormJson,
  type ContactFormJsonState,
} from "@/lib/admin/mutations-data";

export default function ContactFormEditor({ initialJson }: { initialJson: string }) {
  const [state, formAction, pending] = useActionState(updateContactFormJson, null as ContactFormJsonState);

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <div className="form-field">
        <label className="form-label" htmlFor="configJson">
          Contact form (JSON)
        </label>
        <textarea
          id="configJson"
          name="configJson"
          required
          rows={32}
          defaultValue={initialJson}
          className={`form-input font-mono text-xs leading-relaxed${state?.error ? " error" : ""}`}
          spellCheck={false}
        />
        {state?.error ? (
          <p className="form-error" role="alert">
            {state.error}
          </p>
        ) : (
          <p className="text-xs text-text-tertiary">
            Must match <code className="font-mono">ContactFormConfigParsed</code>: labels, budgetOptions, projectOptions,
            placeholders, validation, submit, success, error, footerNote, etc.
          </p>
        )}
      </div>
      <button type="submit" className="btn btn-primary w-fit" disabled={pending}>
        {pending ? "Saving…" : "Save form config"}
      </button>
    </form>
  );
}
