"use client";

import { useActionState, useEffect, useRef } from "react";
import { useAdminToast } from "@/components/admin/AdminToast";
import {
  updateContactFormJson,
  type ContactFormJsonState,
} from "@/lib/admin/mutations-data";

export default function ContactFormEditor({ initialJson }: { initialJson: string }) {
  const [state, formAction, pending] = useActionState(updateContactFormJson, null as ContactFormJsonState);
  const { success } = useAdminToast();
  const wasPending = useRef(false);

  useEffect(() => {
    if (wasPending.current && !pending && !state?.error) {
      success("Form config saved");
    }
    wasPending.current = pending;
  }, [pending, state?.error, success]);

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
            placeholders, validation, submit, success, error (<code className="font-mono">generic</code>, optional{" "}
            <code className="font-mono">displayEmail</code>), footerNote, etc. Error copy can also be edited above without
            touching JSON.
          </p>
        )}
      </div>
      <button type="submit" className="btn btn-primary w-fit" disabled={pending}>
        {pending ? "Saving…" : "Save form config"}
      </button>
    </form>
  );
}
