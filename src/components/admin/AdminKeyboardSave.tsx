"use client";

import { useEffect } from "react";

/**
 * Cmd+S / Ctrl+S submits the CMS form: the one containing focus, or the only
 * form in <main> (logout lives outside main).
 */
export default function AdminKeyboardSave() {
  useEffect(() => {
    function formsInMain(): HTMLFormElement[] {
      const main = document.querySelector("main");
      if (!main) return [];
      return Array.from(main.querySelectorAll("form"));
    }

    function onKeyDown(e: KeyboardEvent) {
      if (e.repeat) return;
      if (!e.metaKey && !e.ctrlKey) return;
      if (e.key !== "s" && e.key !== "S") return;

      const mainForms = formsInMain();
      if (mainForms.length === 0) return;

      const el = document.activeElement;
      if (el instanceof HTMLElement) {
        const focused = el.closest("form");
        if (focused && mainForms.includes(focused as HTMLFormElement)) {
          e.preventDefault();
          (focused as HTMLFormElement).requestSubmit();
          return;
        }
      }

      if (mainForms.length === 1) {
        e.preventDefault();
        mainForms[0].requestSubmit();
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return null;
}
