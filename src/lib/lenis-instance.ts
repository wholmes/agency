import type Lenis from "lenis";

let activeLenis: Lenis | null = null;

/** Called from SmoothScroll when Lenis boots / tears down. */
export function registerLenis(instance: Lenis | null): void {
  activeLenis = instance;
}

/** Scroll to top — prefers Lenis when active so it stays in sync with smooth scroll. */
export function scrollDocumentToTop(): void {
  if (typeof window === "undefined") return;
  if (activeLenis) {
    activeLenis.scrollTo(0, { immediate: true });
    return;
  }
  window.scrollTo(0, 0);
}
