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
    <section className="min-h-dvh pt-[calc(var(--nav-height)+6rem)] pb-40">
      <div className="container">
        <div className="grid grid-cols-1 items-start gap-16 lg:grid-cols-[1fr_1.1fr]">
          <div>
            <ScrollReveal>
              <p className="text-overline mb-5">Contact</p>
            </ScrollReveal>
            <ScrollReveal delay={80}>
              <h1 className="text-h1 mb-6">
                Let&rsquo;s talk about <em className="italic-display text-accent">your project</em>
              </h1>
            </ScrollReveal>
            <ScrollReveal delay={160}>
              <p className="text-body-lg mb-10">
                Tell us what you&rsquo;re building, what problem you&rsquo;re solving, and what you&rsquo;ve tried before. We
                respond within one business day.
              </p>
            </ScrollReveal>

            <ScrollReveal delay={240}>
              <div className="mb-10">
                <p className="mb-5 text-xs font-medium tracking-wider text-text-tertiary uppercase">
                  What happens next
                </p>
                {[
                  { step: "01", text: "We read your message and respond within 1 business day" },
                  { step: "02", text: "If it sounds like a good fit, we schedule a 30-min discovery call" },
                  { step: "03", text: "We send a clear proposal with scope, timeline, and investment" },
                ].map((item) => (
                  <div key={item.step} className="mb-5 flex items-start gap-4">
                    <span className="mt-[0.15em] min-w-8 font-mono text-xs tracking-wider text-accent">{item.step}</span>
                    <p className="text-sm leading-relaxed text-text-secondary">{item.text}</p>
                  </div>
                ))}
              </div>
            </ScrollReveal>

            <ScrollReveal delay={320}>
              <div className="flex flex-col gap-4">
                <p className="text-xs font-medium tracking-wider text-text-tertiary uppercase">Prefer a different route?</p>
                <a
                  href="mailto:hello@brandmeetscode.com"
                  className="contact-alt flex items-center gap-3 rounded-md border border-border bg-surface p-4 no-underline transition-colors [transition-duration:var(--duration-base)] [transition-timing-function:var(--ease-out)] hover:border-accent-muted"
                >
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-sm border border-accent-muted bg-accent-subtle text-accent">
                    <IconEmail size={16} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-text-primary">Email directly</p>
                    <p className="text-xs text-text-secondary">hello@brandmeetscode.com</p>
                  </div>
                </a>
                <a
                  href="https://calendly.com/brandmeetscode"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact-alt flex items-center gap-3 rounded-md border border-border bg-surface p-4 no-underline transition-colors [transition-duration:var(--duration-base)] [transition-timing-function:var(--ease-out)] hover:border-accent-muted"
                >
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-sm border border-accent-muted bg-accent-subtle text-accent">
                    <IconCalendar size={16} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-text-primary">Book a call</p>
                    <p className="text-xs text-text-secondary">30-minute discovery call, no obligation</p>
                  </div>
                </a>
              </div>
            </ScrollReveal>
          </div>

          <ScrollReveal delay={120}>
            <div className="sticky top-[calc(var(--nav-height)+2rem)] rounded-lg border border-border bg-surface p-10">
              <ContactForm />
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
