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

        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-border pt-6">
          <p className="text-xs tracking-wide text-text-tertiary">
            &copy; {year} BrandMeetsCode. All rights reserved.
          </p>
          <p className="text-xs text-text-tertiary">Crafted with intention.</p>
        </div>
      </div>
    </footer>
  );
}
