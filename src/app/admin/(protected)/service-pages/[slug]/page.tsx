import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { updateServiceDetailPage } from "@/lib/admin/mutations-data";

interface Props {
  params: Promise<{ slug: string }>;
}

function prettyJson(s: string): string {
  try {
    return JSON.stringify(JSON.parse(s), null, 2);
  } catch {
    return s;
  }
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const p = await prisma.serviceDetailPage.findUnique({ where: { slug } });
  return { title: p ? `Admin — ${p.heroTitle}` : "Admin — Service page" };
}

export default async function AdminServiceDetailEditPage({ params }: Props) {
  const { slug } = await params;
  const p = await prisma.serviceDetailPage.findUnique({ where: { slug } });
  if (!p) notFound();

  const save = updateServiceDetailPage.bind(null, p.slug);

  return (
    <div className="mx-auto max-w-2xl space-y-12">
      <div>
        <p className="mb-1 text-xs text-text-tertiary">
          <Link href="/admin/service-pages" className="text-text-secondary no-underline hover:text-text-primary">
            ← All service pages
          </Link>
        </p>
        <h1 className="font-display text-2xl font-light tracking-tight">{p.heroTitle}</h1>
        <p className="text-xs text-text-tertiary">Slug: {p.slug}</p>
      </div>

      <section>
        <h2 className="mb-4 text-sm font-medium uppercase tracking-wider text-text-tertiary">SEO</h2>
        <form action={save} className="flex flex-col gap-4">
          <div className="form-field">
            <label className="form-label">Meta title</label>
            <input name="metaTitle" required defaultValue={p.metaTitle} className="form-input" />
          </div>
          <div className="form-field">
            <label className="form-label">Meta description</label>
            <textarea name="metaDescription" required rows={3} defaultValue={p.metaDescription} className="form-input" />
          </div>

          <h2 className="pt-6 text-sm font-medium uppercase tracking-wider text-text-tertiary">Hero</h2>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="heroHasGradient"
              id="heroHasGradient"
              defaultChecked={p.heroHasGradient}
              className="rounded border-border"
            />
            <label htmlFor="heroHasGradient" className="text-sm text-text-secondary">
              Gradient background
            </label>
          </div>
          <div className="form-field">
            <label className="form-label">Overline</label>
            <input name="heroOverline" required defaultValue={p.heroOverline} className="form-input" />
          </div>
          <div className="form-field">
            <label className="form-label">Title</label>
            <input name="heroTitle" required defaultValue={p.heroTitle} className="form-input" />
          </div>
          <div className="form-field">
            <label className="form-label">Body</label>
            <textarea name="heroBody" required rows={5} defaultValue={p.heroBody} className="form-input" />
          </div>
          <div className="form-field">
            <label className="form-label">Primary CTA label</label>
            <input name="primaryCtaLabel" required defaultValue={p.primaryCtaLabel} className="form-input" />
          </div>
          <div className="form-field">
            <label className="form-label">Primary CTA href</label>
            <input name="primaryCtaHref" required defaultValue={p.primaryCtaHref} className="form-input" />
          </div>
          <div className="form-field">
            <label className="form-label">Back link label</label>
            <input name="backLinkLabel" required defaultValue={p.backLinkLabel} className="form-input" />
          </div>
          <div className="form-field">
            <label className="form-label">Back link href</label>
            <input name="backLinkHref" required defaultValue={p.backLinkHref} className="form-input" />
          </div>

          <h2 className="pt-6 text-sm font-medium uppercase tracking-wider text-text-tertiary">Who it&apos;s for</h2>
          <div className="form-field">
            <label className="form-label">Overline</label>
            <input name="whoForOverline" required defaultValue={p.whoForOverline} className="form-input" />
          </div>
          <div className="form-field">
            <label className="form-label">Heading</label>
            <input name="whoForHeading" required defaultValue={p.whoForHeading} className="form-input" />
          </div>
          <div className="form-field">
            <label className="form-label">Bullets (JSON array of strings)</label>
            <textarea
              name="whoForBullets"
              required
              rows={8}
              defaultValue={prettyJson(p.whoForBullets)}
              className="form-input font-mono text-xs"
              spellCheck={false}
            />
          </div>

          <h2 className="pt-6 text-sm font-medium uppercase tracking-wider text-text-tertiary">What&apos;s included</h2>
          <div className="form-field">
            <label className="form-label">Overline</label>
            <input name="includedOverline" required defaultValue={p.includedOverline} className="form-input" />
          </div>
          <div className="form-field">
            <label className="form-label">Heading</label>
            <input name="includedHeading" required defaultValue={p.includedHeading} className="form-input" />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="includedSectionBgSurface"
              id="includedSectionBgSurface"
              defaultChecked={p.includedSectionBgSurface}
              className="rounded border-border"
            />
            <label htmlFor="includedSectionBgSurface" className="text-sm text-text-secondary">
              Section uses surface background
            </label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="includedItemsUseSurfaceBg"
              id="includedItemsUseSurfaceBg"
              defaultChecked={p.includedItemsUseSurfaceBg}
              className="rounded border-border"
            />
            <label htmlFor="includedItemsUseSurfaceBg" className="text-sm text-text-secondary">
              Items use surface background
            </label>
          </div>
          <div className="form-field">
            <label className="form-label">Inclusions (JSON)</label>
            <textarea
              name="inclusions"
              required
              rows={12}
              defaultValue={prettyJson(p.inclusions)}
              className="form-input font-mono text-xs"
              spellCheck={false}
            />
          </div>

          <h2 className="pt-6 text-sm font-medium uppercase tracking-wider text-text-tertiary">FAQ</h2>
          <div className="form-field">
            <label className="form-label">Overline</label>
            <input name="faqOverline" required defaultValue={p.faqOverline} className="form-input" />
          </div>
          <div className="form-field">
            <label className="form-label">Heading</label>
            <input name="faqHeading" required defaultValue={p.faqHeading} className="form-input" />
          </div>
          <div className="form-field">
            <label className="form-label">FAQs (JSON array of {`{ question, answer }`})</label>
            <textarea
              name="faqs"
              required
              rows={14}
              defaultValue={prettyJson(p.faqs)}
              className="form-input font-mono text-xs"
              spellCheck={false}
            />
          </div>

          <button type="submit" className="btn btn-primary mt-4 w-fit">
            Save
          </button>
        </form>
      </section>
    </div>
  );
}
