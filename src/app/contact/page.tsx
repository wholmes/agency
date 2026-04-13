import type { Metadata } from "next";
import ContactForm from "@/components/ContactForm";
import ScrollReveal from "@/components/ScrollReveal";
import { IconEmail, IconCalendar } from "@/components/icons";
import { getContactFormConfig, getContactPageCopy, getSiteSettings } from "@/lib/cms/queries";

export async function generateMetadata(): Promise<Metadata> {
  const copy = await getContactPageCopy();
  return {
    title: copy.metaTitle,
    description: copy.metaDescription,
    alternates: {
      canonical: "https://brandmeetscode.com/contact",
    },
  };
}

export default async function ContactPage() {
  const [copy, settings, formConfig] = await Promise.all([
    getContactPageCopy(),
    getSiteSettings(),
    getContactFormConfig(),
  ]);
  const email = settings.contactEmail;

  return (
    <section className="min-h-dvh pt-[calc(var(--nav-height)+6rem)] pb-40">
      <div className="container">
        <div className="grid grid-cols-1 items-start gap-16 lg:grid-cols-[1fr_1.1fr]">
          <div>
            <ScrollReveal>
              <p className="text-overline mb-5">{copy.overline}</p>
            </ScrollReveal>
            <ScrollReveal delay={80}>
              <h1 className="text-h1 mb-6">
                {copy.heroLineBeforeEm}
                <em className="italic-display text-accent">{copy.heroEmphasis}</em>
                {copy.heroLineAfterEm}
              </h1>
            </ScrollReveal>
            <ScrollReveal delay={160}>
              <p className="text-body-lg mb-10">{copy.introParagraph}</p>
            </ScrollReveal>

            <ScrollReveal delay={240}>
              <div className="mb-10">
                <p className="mb-5 text-xs font-medium tracking-wider text-text-tertiary uppercase">
                  {copy.whatHappensHeading}
                </p>
                {copy.nextSteps.map((item) => (
                  <div key={item.step} className="mb-5 flex items-start gap-4">
                    <span className="mt-[0.15em] min-w-8 font-mono text-xs tracking-wider text-accent">{item.step}</span>
                    <p className="text-sm leading-relaxed text-text-secondary">{item.text}</p>
                  </div>
                ))}
              </div>
            </ScrollReveal>

            <ScrollReveal delay={320}>
              <div className="flex flex-col gap-4">
                <p className="text-xs font-medium tracking-wider text-text-tertiary uppercase">{copy.altRoutesHeading}</p>
                <a
                  href={`mailto:${email}`}
                  className="contact-alt flex items-center gap-3 rounded-md border border-border bg-surface p-4 no-underline transition-colors [transition-duration:var(--duration-base)] [transition-timing-function:var(--ease-out)] hover:border-accent-muted"
                >
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-sm border border-accent-muted bg-accent-subtle text-accent">
                    <IconEmail size={16} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-text-primary">{copy.emailCardTitle}</p>
                    <p className="text-xs text-text-secondary">{email}</p>
                  </div>
                </a>
                <a
                  href={copy.calendlyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact-alt flex items-center gap-3 rounded-md border border-border bg-surface p-4 no-underline transition-colors [transition-duration:var(--duration-base)] [transition-timing-function:var(--ease-out)] hover:border-accent-muted"
                >
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-sm border border-accent-muted bg-accent-subtle text-accent">
                    <IconCalendar size={16} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-text-primary">{copy.calendarCardTitle}</p>
                    <p className="text-xs text-text-secondary">{copy.calendarCardSubtitle}</p>
                  </div>
                </a>
              </div>
            </ScrollReveal>
          </div>

          <ScrollReveal delay={120}>
            <div className="sticky top-[calc(var(--nav-height)+2rem)] rounded-lg border border-border bg-surface p-10">
              <ContactForm config={formConfig} contactEmail={email} />
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
