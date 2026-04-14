"use client";

import { useActionState, useEffect, useRef } from "react";
import { useAdminToast } from "@/components/admin/AdminToast";
import { updateSiteChromeJson, type ChromeFormState } from "../mutations";

export default function ChromeEditor({ initialJson }: { initialJson: string }) {
  const [state, formAction, pending] = useActionState(updateSiteChromeJson, null as ChromeFormState);
  const { success } = useAdminToast();
  const wasPending = useRef(false);

  useEffect(() => {
    if (wasPending.current && !pending && !state?.error) {
      success("Saved");
    }
    wasPending.current = pending;
  }, [pending, state?.error, success]);

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <div className="form-field">
        <label className="form-label" htmlFor="configJson">
          Site chrome (JSON)
        </label>
        <textarea
          id="configJson"
          name="configJson"
          required
          rows={28}
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
            Structure must match <code className="font-mono">SiteChromeConfigParsed</code> in the codebase
            (navLinks, primaryCta, footerColumns, footerUtilityLinks, copyrightBrandName, rightsReservedLine).
          </p>
        )}
      </div>
      <button type="submit" className="btn btn-primary w-fit" disabled={pending}>
        {pending ? "Saving…" : "Save"}
      </button>
    </form>
  );
}
