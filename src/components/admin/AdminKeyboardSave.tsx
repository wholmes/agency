"use client";

import { useEffect } from "react";

/**
 * Cmd+S / Ctrl+S submits the CMS form: the one containing focus, or the only
 * form in <main> (logout lives outside main).
 */
export default function AdminKeyboardSave() {
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.repeat) return;
      if (!e.metaKey && !e.ctrlKey) return;
      if (e.key !== "s" && e.key !== "S") return;

      // Prefer the explicitly-marked save form
      const saveForm = document.querySelector<HTMLFormElement>("main form[data-save-form]");

      // Also accept whichever form currently has focus
      const el = document.activeElement;
      const focusedForm =
        el instanceof HTMLElement ? el.closest<HTMLFormElement>("form") : null;

      const target = focusedForm ?? saveForm;
      if (!target) return;

      e.preventDefault();
      target.requestSubmit();
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return null;
}
