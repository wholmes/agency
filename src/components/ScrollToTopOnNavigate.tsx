"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { scrollDocumentToTop } from "@/lib/lenis-instance";

/**
 * Client navigations should open each route at the top. Lenis does not reset
 * automatically; we scroll after Next commits the new page.
 * URLs with a hash are left alone so in-page anchors still work.
 */
export default function ScrollToTopOnNavigate() {
  const pathname = usePathname();

  useEffect(() => {
    requestAnimationFrame(() => {
      if (typeof window === "undefined") return;
      if (window.location.hash) return;
      scrollDocumentToTop();
    });
  }, [pathname]);

  return null;
}
