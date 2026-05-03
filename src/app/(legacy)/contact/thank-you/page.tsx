import type { Metadata } from "next";
import Link from "next/link";
import { IconCheck, IconArrowUpRight } from "@/components/icons";
import ContactConversionDataLayer from "@/components/ContactConversionDataLayer";
import { getContactFormConfig, getSiteSettings } from "@/lib/cms/queries";

function interpolateEmail(template: string, email: string): string {
  return template.replace(/\{\{email\}\}/g, email);
}

export const metadata: Metadata = {
  title: "Thank you — BrandMeetsCode",
  description: "Your message was received.",
  robots: { index: false, follow: true },
  alternates: { canonical: "https://brandmeetscode.com/contact/thank-you" },
};

export default async function ContactThankYouPage() {
  const [formConfig, settings] = await Promise.all([getContactFormConfig(), getSiteSettings()]);
  const { success } = formConfig;
  const email = settings.contactEmail;

  return (
    <div className="relative min-h-dvh overflow-x-hidden bg-[#0e0e0e]">
      <ContactConversionDataLayer />
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
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 h-[420px] w-[900px] -translate-x-1/2 -translate-y-1/4"
        style={{
          background: "radial-gradient(ellipse at 50% 0%, rgba(201,165,90,0.07) 0%, transparent 55%)",
        }}
      />

      <section className="relative flex min-h-dvh flex-col items-center justify-center px-8 pb-24 pt-[calc(var(--nav-height)+3rem)] md:px-16">
        <div className="mx-auto w-full max-w-lg text-center">
          <p className="mb-8 font-mono text-[10px] uppercase tracking-[0.25em] text-white/45">BrandMeetsCode</p>

          <div className="mb-8 flex justify-center">
            <div
              className="flex size-16 items-center justify-center rounded-full border border-[#6b5530] bg-[#1f1912] text-[#c9a55a]"
              aria-hidden
            >
              <IconCheck size={28} />
            </div>
          </div>

          <h1 className="mb-4 font-display text-[clamp(1.75rem,4.5vw,2.5rem)] font-light leading-tight tracking-[-0.02em] text-white">
            {success.title}
          </h1>
          <p className="mb-10 text-[clamp(0.95rem,1.1vw,1.05rem)] leading-relaxed text-white/55">
            {interpolateEmail(success.body, email)}
          </p>

          <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">What’s next</p>
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/[0.1] bg-white/[0.04] px-6 py-3.5 font-body text-sm font-medium text-white no-underline transition-all hover:border-[#c9a55a]/40 hover:bg-[rgba(201,165,90,0.08)]"
            >
              Back to home
              <IconArrowUpRight size={15} className="opacity-70" />
            </Link>
            <Link
              href="/work"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#c9a55a] px-6 py-3.5 font-body text-sm font-semibold text-[#080808] no-underline transition-all hover:bg-[#d4b46a] hover:shadow-[0_0_24px_rgba(201,165,90,0.25)]"
            >
              View our work
              <IconArrowUpRight size={15} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
