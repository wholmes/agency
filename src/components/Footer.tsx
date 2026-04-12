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
      style={{
        borderTop: "1px solid var(--color-border)",
        backgroundColor: "var(--color-surface)",
        paddingTop: "var(--space-16)",
        paddingBottom: "var(--space-10)",
      }}
    >
      <div className="container">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: "var(--space-12)",
            marginBottom: "var(--space-16)",
          }}
          className="footer-grid"
        >
          {/* Brand column */}
          <div>
            <Link
              href="/"
              style={{ display: "inline-flex", alignItems: "center", gap: "var(--space-3)", marginBottom: "var(--space-5)" }}
              aria-label="BrandMeetsCode — Home"
            >
              <LogoMark size={24} style={{ color: "var(--color-accent)" } as React.CSSProperties} />
              <span
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "var(--text-md)",
                  fontWeight: 400,
                  letterSpacing: "-0.01em",
                }}
              >
                Brand<span style={{ color: "var(--color-accent)" }}>Meets</span>Code
              </span>
            </Link>
            <p
              style={{
                fontSize: "var(--text-sm)",
                color: "var(--color-text-secondary)",
                lineHeight: 1.7,
                maxWidth: "300px",
                marginBottom: "var(--space-6)",
              }}
            >
              Premium web development where brand strategy meets technical execution.
            </p>
            <a
              href="mailto:hello@brandmeetscode.com"
              style={{
                fontSize: "var(--text-sm)",
                color: "var(--color-accent)",
                textDecoration: "none",
                transition: "opacity var(--duration-base) var(--ease-out)",
              }}
              className="footer-email"
            >
              hello@brandmeetscode.com
            </a>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([group, links]) => (
            <nav key={group} aria-label={`${group} links`}>
              <p
                style={{
                  fontSize: "var(--text-xs)",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "var(--color-text-tertiary)",
                  marginBottom: "var(--space-5)",
                  fontWeight: 500,
                }}
              >
                {group}
              </p>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      style={{
                        fontSize: "var(--text-sm)",
                        color: "var(--color-text-secondary)",
                        textDecoration: "none",
                        transition: "color var(--duration-base) var(--ease-out)",
                      }}
                      className="footer-link"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        {/* Bottom bar */}
        <div
          style={{
            borderTop: "1px solid var(--color-border)",
            paddingTop: "var(--space-6)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "var(--space-4)",
          }}
        >
          <p
            style={{
              fontSize: "var(--text-xs)",
              color: "var(--color-text-tertiary)",
              letterSpacing: "0.04em",
            }}
          >
            &copy; {year} BrandMeetsCode. All rights reserved.
          </p>
          <p
            style={{
              fontSize: "var(--text-xs)",
              color: "var(--color-text-tertiary)",
            }}
          >
            Crafted with intention.
          </p>
        </div>
      </div>

      <style>{`
        .footer-email:hover { opacity: 0.7; }
        .footer-link:hover { color: var(--color-text-primary) !important; }
        @media (min-width: 640px) {
          .footer-grid {
            grid-template-columns: 1.5fr 1fr 1fr !important;
          }
        }
      `}</style>
    </footer>
  );
}
