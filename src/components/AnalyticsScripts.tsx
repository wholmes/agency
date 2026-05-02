"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}

interface Props {
  gaId?: string;
  gtmId?: string;
}

export default function AnalyticsScripts({ gaId, gtmId }: Props) {
  const pathname = usePathname();
  const prevPathForVirtualPv = useRef<string | null>(null);

  const hasGa = gaId && gaId.startsWith("G-");
  const hasGtm = gtmId && gtmId.startsWith("GTM-");

  /**
   * GTM fires its initial Page View on container load. Next.js App Router navigations do not reload
   * the page — push a named event so tags (Meta Pixel, GA4, etc.) configured in GTM can fire again.
   */
  useEffect(() => {
    if (!hasGtm || typeof window === "undefined") return;
    window.dataLayer = window.dataLayer ?? [];

    const prev = prevPathForVirtualPv.current;
    prevPathForVirtualPv.current = pathname;

    if (prev !== null && prev !== pathname) {
      window.dataLayer.push({
        event: "virtual_page_view",
        page_path: pathname,
        page_location: window.location.href,
        page_title: document.title,
      });
    }
  }, [pathname, hasGtm]);

  return (
    <>
      {/* Google Tag Manager — <head> snippet */}
      {hasGtm && (
        <Script
          id="gtm-head"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${gtmId}');`,
          }}
        />
      )}

      {/* GTM <noscript> fallback — injected just after <body> via a portal */}
      {hasGtm && (
        <noscript
          dangerouslySetInnerHTML={{
            __html: `<iframe src="https://www.googletagmanager.com/ns.html?id=${gtmId}" height="0" width="0" style="display:none;visibility:hidden" title="Google Tag Manager"></iframe>`,
          }}
        />
      )}

      {/* Google Analytics 4 — only load if GTM is NOT present (avoid double-counting) */}
      {hasGa && !hasGtm && (
        <>
          <Script
            id="ga-load"
            strategy="afterInteractive"
            src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
          />
          <Script
            id="ga-init"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${gaId}',{page_path:window.location.pathname});`,
            }}
          />
        </>
      )}
    </>
  );
}
