import type { Metadata } from "next";
import ContactForm from "@/components/ContactForm";
import ScrollReveal from "@/components/ScrollReveal";
import { IconEmail, IconCalendar, IconArrowUpRight } from "@/components/icons";
import { getContactFormConfig, getContactPageCopy, getSiteSettings } from "@/lib/cms/queries";
import { appendUtmToUrl, utmFromCalendlyDb } from "@/lib/utm";

export async function generateMetadata(): Promise<Metadata> {
  const copy = await getContactPageCopy();
  return {
    title: copy.metaTitle,
    description: copy.metaDescription,
    alternates: {
      canonical: "https://brandmeetscode.com/contact",
    },
    openGraph: {
      title: copy.metaTitle,
      description: copy.metaDescription,
      url: "https://brandmeetscode.com/contact",
      siteName: "BrandMeetsCode",
      type: "website",
      images: [{ url: "https://brandmeetscode.com/opengraph-image", width: 1200, height: 630, alt: copy.metaTitle }],
    },
    twitter: {
      card: "summary_large_image",
      title: copy.metaTitle,
      description: copy.metaDescription,
      images: ["https://brandmeetscode.com/opengraph-image"],
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
  const calendlyHref = appendUtmToUrl(copy.calendlyUrl, utmFromCalendlyDb(copy));

  return (
    <div className="relative overflow-x-hidden bg-[#0e0e0e]">
      {/* Noise grain — matches homepage / about */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-[9999]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "200px 200px",
          opacity: 0.04,
          mixBlendMode: "overlay",
        }}
      />

      {/* Top gold bloom — subtle */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 h-[420px] w-[900px] -translate-x-1/2 -translate-y-1/4"
        style={{
          background: "radial-gradient(ellipse at 50% 0%, rgba(201,165,90,0.07) 0%, transparent 55%)",
        }}
      />

      <section className="relative min-h-dvh pt-[calc(var(--nav-height)+3rem)] pb-24 md:pb-32">
        <div className="mx-auto max-w-[1280px] px-8 md:px-16">
          <div className="grid grid-cols-1 items-start gap-14 lg:grid-cols-[1fr_1.05fr] lg:gap-20">
            {/* Copy column */}
            <div>
              <ScrollReveal>
                <div className="mb-10 flex items-center gap-6">
                  <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/45">{copy.overline}</p>
                  <div className="h-px flex-1 bg-white/[0.06]" />
                </div>
              </ScrollReveal>

              <ScrollReveal delay={80}>
                <h1 className="mb-8 font-display text-[clamp(2.25rem,5.5vw,3.75rem)] font-light leading-[1.02] tracking-[-0.03em] text-white">
                  <span className="block">{copy.heroLineBeforeEm.trimEnd()}</span>
                  <span className="block">
                    <em className="font-display italic text-[#c9a55a]">{copy.heroEmphasis}</em>
                    {copy.heroLineAfterEm}
                  </span>
                </h1>
              </ScrollReveal>

              <ScrollReveal delay={140}>
                <p className="mb-14 max-w-[520px] text-[clamp(1rem,1.15vw,1.125rem)] leading-relaxed text-white/55">
                  {copy.introParagraph}
                </p>
              </ScrollReveal>

              <ScrollReveal delay={200}>
                <div className="mb-14 border-t border-white/[0.06] pt-10">
                  <p className="mb-8 font-mono text-[10px] uppercase tracking-[0.25em] text-white/40">
                    {copy.whatHappensHeading}
                  </p>
                  <ul className="flex flex-col gap-6">
                    {copy.nextSteps.map((item) => (
                      <li key={item.step} className="flex gap-5">
                        <span
                          className="mt-0.5 shrink-0 font-mono text-[11px] tabular-nums tracking-wider"
                          style={{ color: "#c9a55a" }}
                        >
                          {item.step}
                        </span>
                        <p className="text-[15px] leading-relaxed text-white/65">{item.text}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              </ScrollReveal>

              <ScrollReveal delay={260}>
                <div>
                  <p className="mb-5 font-mono text-[10px] uppercase tracking-[0.25em] text-white/40">
                    {copy.altRoutesHeading}
                  </p>
                  <div className="flex flex-col gap-3">
                    <a
                      href={`mailto:${email}`}
                      className="group flex items-center gap-4 rounded-xl border border-white/[0.08] bg-white/[0.02] px-5 py-4 no-underline transition-[border-color,background-color,box-shadow] duration-300 ease-out hover:border-[#c9a55a]/45 hover:bg-[rgba(201,165,90,0.06)]"
                    >
                      <div className="flex size-11 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-[#131313] text-[#c9a55a] transition-colors group-hover:border-[#c9a55a]/35">
                        <IconEmail size={18} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-body text-[15px] font-medium text-white">{copy.emailCardTitle}</p>
                        <p className="truncate font-mono text-[12px] text-white/45">{email}</p>
                      </div>
                      <IconArrowUpRight size={16} className="shrink-0 text-white/25 transition-colors group-hover:text-[#c9a55a]" aria-hidden />
                    </a>
                    <a
                      href={calendlyHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center gap-4 rounded-xl border border-white/[0.08] bg-white/[0.02] px-5 py-4 no-underline transition-[border-color,background-color,box-shadow] duration-300 ease-out hover:border-[#c9a55a]/45 hover:bg-[rgba(201,165,90,0.06)]"
                    >
                      <div className="flex size-11 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-[#131313] text-[#c9a55a] transition-colors group-hover:border-[#c9a55a]/35">
                        <IconCalendar size={18} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-body text-[15px] font-medium text-white">{copy.calendarCardTitle}</p>
                        <p className="text-[13px] text-white/45">{copy.calendarCardSubtitle}</p>
                      </div>
                      <IconArrowUpRight size={16} className="shrink-0 text-white/25 transition-colors group-hover:text-[#c9a55a]" aria-hidden />
                    </a>
                  </div>
                </div>
              </ScrollReveal>
            </div>

            {/* Form panel */}
            <ScrollReveal delay={120}>
              <div
                className="lg:sticky lg:top-[calc(var(--nav-height)+1.5rem)]"
                style={{
                  borderRadius: "16px",
                  border: "1px solid rgba(255,255,255,0.08)",
                  background: "rgba(255,255,255,0.02)",
                  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.06), 0 -20px 80px rgba(0,0,0,0.35)",
                  backdropFilter: "blur(12px)",
                }}
              >
                <div className="p-8 md:p-10">
                  <ContactForm config={formConfig} contactEmail={email} variant="v2" />
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>
    </div>
  );
}
