import Link from "next/link";
import StackLogos from "./StackLogos";
import type { SiteChromeConfigParsed } from "@/lib/cms/site-chrome-types";

export default function Footer({
  tagline,
  remoteBlurb,
  contactEmail,
  chrome,
}: {
  tagline: string;
  remoteBlurb: string;
  contactEmail: string;
  chrome: SiteChromeConfigParsed;
}) {
  const year = new Date().getFullYear();
  const mailto = `mailto:${contactEmail}`;

  return (
    <footer
      role="contentinfo"
      className="border-t border-border bg-surface pt-16 pb-10"
    >
      <div className="container">
        <div className="mb-16 grid grid-cols-1 gap-12 sm:grid-cols-[1.5fr_1fr_1fr]">
          <div>
            <Link
              href="/"
              className="mb-5 inline-flex items-center gap-3"
              aria-label="BrandMeetsCode — Home"
            >
              <span
                className="inline-flex size-7 shrink-0 items-center justify-center rounded-full border border-accent/50 text-accent opacity-90"
                aria-hidden="true"
              >
                <span className="font-mono text-[0.8125rem] font-semibold leading-none">B</span>
              </span>
              <span className="font-display text-md font-normal tracking-tight text-text-primary">
                Brand<em className="inline-block -rotate-6 italic text-accent">Meets</em>Code
              </span>
            </Link>
            <p className="mb-6 max-w-[300px] text-sm leading-relaxed text-text-secondary">{tagline}</p>
            <a
              href={mailto}
              className="text-sm text-accent no-underline transition-opacity [transition-duration:var(--duration-base)] [transition-timing-function:var(--ease-out)] hover:opacity-70"
            >
              {contactEmail}
            </a>
          </div>

          {chrome.footerColumns.map((column) => (
            <nav key={column.title} aria-label={`${column.title} links`}>
              <p className="mb-5 text-xs font-medium tracking-[0.12em] text-text-tertiary uppercase">
                {column.title}
              </p>
              <ul className="flex flex-col gap-3 list-none">
                {column.links.map((link) => (
                  <li key={`${column.title}-${link.href}-${link.label}`}>
                    <Link
                      href={link.href}
                      className="text-sm text-text-secondary no-underline transition-colors [transition-duration:var(--duration-base)] [transition-timing-function:var(--ease-out)] hover:text-text-primary"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="border-t border-border pt-10">
          <p className="mb-8 max-w-[520px] text-xs leading-relaxed tracking-wide text-text-secondary">
            {remoteBlurb}
          </p>

          <div className="mb-10">
            <StackLogos />
          </div>

          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex items-center gap-4">
              <p className="font-mono text-[11px] tracking-[0.08em] text-text-tertiary uppercase">
                &copy; {year} {chrome.copyrightBrandName}
              </p>
              <span aria-hidden="true" className="text-border">·</span>
              <p className="font-mono text-[11px] tracking-[0.08em] text-text-tertiary uppercase">
                Chicago, IL
              </p>
            </div>
            <nav aria-label="Legal and utility" className="flex flex-wrap gap-x-8 gap-y-2">
              {chrome.footerUtilityLinks.map((link) => (
                <Link
                  key={`${link.href}-${link.label}`}
                  href={link.href}
                  className="text-xs tracking-wide text-text-secondary no-underline transition-colors [transition-duration:var(--duration-base)] [transition-timing-function:var(--ease-out)] hover:text-text-primary"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>


          <p className="mt-6 font-mono text-[10px] tracking-[0.12em] text-text-tertiary uppercase">
            {chrome.rightsReservedLine}
          </p>
        </div>
      </div>
    </footer>
  );
}
