"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import {
  BMC_VISITOR_COOKIE_NAME,
  bmcVisitorIdBootstrapInlineScript,
} from "@/lib/bmc-visitor-id";

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}

interface Props {
  gaId?: string;
  gtmId?: string;
}

/*
 * GTM (web → server GTM): map first-party id to GA4 client_id
 * -----------------------------------------------------------
 * 1. Variables → New → First Party Cookie → Name: bmc_vid → Save as e.g. "Cookie - bmc_vid".
 * 2. Open your GA4 Configuration tag → Fields to set → Add row:
 *    Field name: client_id    Value: {{Cookie - bmc_vid}}
 * 3. Publish. (Event tags on the same stream inherit this client_id.)
 *
 * Optional: Data Layer Variable name `bmc_vid` — the bootstrap also pushes it before gtm.js.
 *
 * When you add a consent banner, only inject the bootstrap script after analytics consent
 * (or split: set cookie after consent; until then omit the beforeInteractive visitor script).
 */
export default function AnalyticsScripts({ gaId, gtmId }: Props) {
  const pathname = usePathname();
  const prevPathForVirtualPv = useRef<string | null>(null);

  const hasGa = gaId && gaId.startsWith("G-");
  const hasGtm = gtmId && gtmId.startsWith("GTM-");
  const needsVisitorBootstrap = Boolean(hasGtm || hasGa);

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

  const visitorBootstrap = bmcVisitorIdBootstrapInlineScript();

  const gaConfigInline =
    hasGa && !hasGtm
      ? (() => {
          const id = gaId as string;
          return (
            `window.dataLayer=window.dataLayer||[];` +
            `function gtag(){dataLayer.push(arguments);}` +
            `function _bmcReadVid(){var m=document.cookie.match(new RegExp('(?:^|; )${BMC_VISITOR_COOKIE_NAME.replace(/[.*+?^${}()|[\]\\]/g, "\\\\$&")}=([^;]*)'));` +
            `return m?decodeURIComponent((m[1]||'').split('+').join(' ')):'';}` +
            `gtag('js',new Date());` +
            `var _bmc=_bmcReadVid();` +
            `gtag('config','${id}',Object.assign({page_path:window.location.pathname},_bmc?{client_id:_bmc}:{}));`
          );
        })()
      : "";

  return (
    <>
      {needsVisitorBootstrap && (
        <Script
          id="bmc-visitor-id-bootstrap"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: visitorBootstrap }}
        />
      )}

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
              __html: gaConfigInline,
            }}
          />
        </>
      )}
    </>
  );
}
