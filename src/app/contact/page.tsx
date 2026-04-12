import type { Metadata } from "next";
import ContactForm from "@/components/ContactForm";
import ScrollReveal from "@/components/ScrollReveal";
import { IconEmail, IconCalendar } from "@/components/icons";

export const metadata: Metadata = {
  title: "Contact — Start a Project",
  description:
    "Tell us about your project. We respond within one business day with a clear sense of fit, timeline, and what working together would look like.",
  alternates: {
    canonical: "https://brandmeetscode.com/contact",
  },
};

export default function ContactPage() {
  return (
    <>
      <section
        style={{
          paddingTop: "calc(var(--nav-height) + var(--space-24))",
          paddingBottom: "var(--space-40)",
          minHeight: "100dvh",
        }}
      >
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "var(--space-16)", alignItems: "start" }} className="contact-grid">
            {/* Left: copy + alternatives */}
            <div>
              <ScrollReveal>
                <p className="text-overline" style={{ marginBottom: "var(--space-5)" }}>Contact</p>
              </ScrollReveal>
              <ScrollReveal delay={80}>
                <h1 className="text-h1" style={{ marginBottom: "var(--space-6)" }}>
                  Let&rsquo;s talk about{" "}
                  <em className="italic-display" style={{ color: "var(--color-accent)" }}>your project</em>
                </h1>
              </ScrollReveal>
              <ScrollReveal delay={160}>
                <p className="text-body-lg" style={{ marginBottom: "var(--space-10)" }}>
                  Tell us what you&rsquo;re building, what problem you&rsquo;re solving,
                  and what you&rsquo;ve tried before. We respond within one business day.
                </p>
              </ScrollReveal>

              {/* What to expect */}
              <ScrollReveal delay={240}>
                <div style={{ marginBottom: "var(--space-10)" }}>
                  <p style={{ fontSize: "var(--text-xs)", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--color-text-tertiary)", marginBottom: "var(--space-5)", fontWeight: 500 }}>
                    What happens next
                  </p>
                  {[
                    { step: "01", text: "We read your message and respond within 1 business day" },
                    { step: "02", text: "If it sounds like a good fit, we schedule a 30-min discovery call" },
                    { step: "03", text: "We send a clear proposal with scope, timeline, and investment" },
                  ].map((item) => (
                    <div key={item.step} style={{ display: "flex", gap: "var(--space-4)", alignItems: "flex-start", marginBottom: "var(--space-5)" }}>
                      <span style={{ fontFamily: "var(--font-mono, monospace)", fontSize: "var(--text-xs)", color: "var(--color-accent)", letterSpacing: "0.1em", minWidth: "2rem", marginTop: "0.15em" }}>
                        {item.step}
                      </span>
                      <p style={{ fontSize: "var(--text-sm)", color: "var(--color-text-secondary)", lineHeight: 1.6 }}>
                        {item.text}
                      </p>
                    </div>
                  ))}
                </div>
              </ScrollReveal>

              {/* Alternatives */}
              <ScrollReveal delay={320}>
                <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
                  <p style={{ fontSize: "var(--text-xs)", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--color-text-tertiary)", fontWeight: 500 }}>
                    Prefer a different route?
                  </p>
                  <a
                    href="mailto:hello@brandmeetscode.com"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "var(--space-3)",
                      padding: "var(--space-4) var(--space-5)",
                      background: "var(--color-surface)",
                      border: "1px solid var(--color-border)",
                      borderRadius: "var(--radius-md)",
                      textDecoration: "none",
                      transition: "border-color var(--duration-base) var(--ease-out)",
                    }}
                    className="contact-alt"
                  >
                    <div style={{ width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", background: "var(--color-accent-subtle)", border: "1px solid var(--color-accent-muted)", borderRadius: "var(--radius-sm)", color: "var(--color-accent)", flexShrink: 0 }}>
                      <IconEmail size={16} />
                    </div>
                    <div>
                      <p style={{ fontSize: "var(--text-sm)", fontWeight: 500, color: "var(--color-text-primary)" }}>Email directly</p>
                      <p style={{ fontSize: "var(--text-xs)", color: "var(--color-text-secondary)" }}>hello@brandmeetscode.com</p>
                    </div>
                  </a>
                  <a
                    href="https://calendly.com/brandmeetscode"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "var(--space-3)",
                      padding: "var(--space-4) var(--space-5)",
                      background: "var(--color-surface)",
                      border: "1px solid var(--color-border)",
                      borderRadius: "var(--radius-md)",
                      textDecoration: "none",
                      transition: "border-color var(--duration-base) var(--ease-out)",
                    }}
                    className="contact-alt"
                  >
                    <div style={{ width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", background: "var(--color-accent-subtle)", border: "1px solid var(--color-accent-muted)", borderRadius: "var(--radius-sm)", color: "var(--color-accent)", flexShrink: 0 }}>
                      <IconCalendar size={16} />
                    </div>
                    <div>
                      <p style={{ fontSize: "var(--text-sm)", fontWeight: 500, color: "var(--color-text-primary)" }}>Book a call</p>
                      <p style={{ fontSize: "var(--text-xs)", color: "var(--color-text-secondary)" }}>30-minute discovery call, no obligation</p>
                    </div>
                  </a>
                </div>
              </ScrollReveal>
            </div>

            {/* Right: form */}
            <ScrollReveal delay={120}>
              <div
                style={{
                  background: "var(--color-surface)",
                  border: "1px solid var(--color-border)",
                  borderRadius: "var(--radius-lg)",
                  padding: "var(--space-10)",
                  position: "sticky",
                  top: "calc(var(--nav-height) + var(--space-8))",
                }}
              >
                <ContactForm />
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      <style>{`
        .contact-alt:hover { border-color: var(--color-accent-muted) !important; }
        @media (min-width: 1024px) {
          .contact-grid { grid-template-columns: 1fr 1.1fr !important; }
        }
      `}</style>
    </>
  );
}
