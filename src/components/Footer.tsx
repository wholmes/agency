import Link from "next/link";
import { LogoMark } from "./icons";

const footerLinks = {
  Services: [
    { label: "Web Design", href: "/services/web-design" },
    { label: "Web Development", href: "/services/web-design" },
    { label: "Brand Strategy", href: "/services/brand-strategy" },
    { label: "Analytics Integration", href: "/services/analytics-integration" },
  ],
  Company: [
    { label: "Work", href: "/work" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ],
};

export default function Footer() {
  const year = new Date().getFullYear();

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
              <LogoMark size={24} className="text-accent" />
              <span className="font-display text-md font-normal tracking-tight text-text-primary">
                Brand<span className="text-accent">Meets</span>Code
              </span>
            </Link>
            <p className="mb-6 max-w-[300px] text-sm leading-relaxed text-text-secondary">
              Premium web development where brand strategy meets technical execution.
            </p>
            <a
              href="mailto:hello@brandmeetscode.com"
              className="text-sm text-accent no-underline transition-opacity [transition-duration:var(--duration-base)] [transition-timing-function:var(--ease-out)] hover:opacity-70"
            >
              hello@brandmeetscode.com
            </a>
          </div>

          {Object.entries(footerLinks).map(([group, links]) => (
            <nav key={group} aria-label={`${group} links`}>
              <p className="mb-5 text-xs font-medium tracking-[0.12em] text-text-tertiary uppercase">
                {group}
              </p>
              <ul className="flex flex-col gap-3 list-none">
                {links.map((link) => (
                  <li key={link.href}>
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
            Remote-first studio. We partner with B2B teams and SaaS founders in the US and Europe — engagements by
            project, with a small number of active builds at a time.
          </p>

          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <p className="font-mono text-[11px] tracking-[0.08em] text-text-tertiary uppercase">
              &copy; {year} BrandMeetsCode
            </p>
            <nav aria-label="Legal and utility" className="flex flex-wrap gap-x-8 gap-y-2">
              <Link
                href="/contact"
                className="text-xs tracking-wide text-text-secondary no-underline transition-colors [transition-duration:var(--duration-base)] [transition-timing-function:var(--ease-out)] hover:text-text-primary"
              >
                Contact
              </Link>
              <Link
                href="/work"
                className="text-xs tracking-wide text-text-secondary no-underline transition-colors [transition-duration:var(--duration-base)] [transition-timing-function:var(--ease-out)] hover:text-text-primary"
              >
                Work
              </Link>
              <Link
                href="/about"
                className="text-xs tracking-wide text-text-secondary no-underline transition-colors [transition-duration:var(--duration-base)] [transition-timing-function:var(--ease-out)] hover:text-text-primary"
              >
                About
              </Link>
              <Link
                href="/services"
                className="text-xs tracking-wide text-text-secondary no-underline transition-colors [transition-duration:var(--duration-base)] [transition-timing-function:var(--ease-out)] hover:text-text-primary"
              >
                Services
              </Link>
            </nav>
          </div>

          <p className="mt-6 font-mono text-[10px] tracking-[0.12em] text-text-tertiary uppercase">
            All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
