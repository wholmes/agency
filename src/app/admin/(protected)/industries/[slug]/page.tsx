import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { updateIndustryPage } from "@/lib/admin/mutations-data";

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
  const row = await prisma.industryPage.findUnique({ where: { slug } });
  return { title: row ? `Admin — ${row.listTitle}` : "Admin — Industry" };
}

export default async function AdminIndustryEditPage({ params }: Props) {
  const { slug } = await params;
  const row = await prisma.industryPage.findUnique({ where: { slug } });
  if (!row) notFound();

  const save = updateIndustryPage.bind(null, row.slug);

  return (
    <div className="mx-auto max-w-2xl space-y-10">
      <div>
        <p className="mb-1 text-xs text-text-tertiary">
          <Link href="/admin/industries" className="text-text-secondary no-underline hover:text-text-primary">
            ← All industries
          </Link>
        </p>
        <h1 className="font-display text-2xl font-light tracking-tight">{row.listTitle}</h1>
        <p className="text-xs text-text-tertiary">
          URL: /industries/<span className="font-mono">{row.slug}</span>
        </p>
      </div>

      <form action={save} className="flex flex-col gap-4">
        <div className="form-field">
          <label className="form-label">Sort order</label>
          <input name="sortOrder" type="number" required defaultValue={row.sortOrder} className="form-input" />
        </div>
        <div className="form-field">
          <label className="form-label">List title (hub card)</label>
          <input name="listTitle" required defaultValue={row.listTitle} className="form-input" />
        </div>
        <div className="form-field">
          <label className="form-label">List blurb (hub card)</label>
          <textarea name="listBlurb" required rows={2} defaultValue={row.listBlurb} className="form-input" />
        </div>
        <div className="form-field">
          <label className="form-label">Meta title</label>
          <input name="metaTitle" required defaultValue={row.metaTitle} className="form-input" />
        </div>
        <div className="form-field">
          <label className="form-label">Meta description</label>
          <textarea name="metaDescription" required rows={3} defaultValue={row.metaDescription} className="form-input" />
        </div>
        <h2 className="pt-4 text-sm font-medium uppercase tracking-wider text-text-tertiary">Hero</h2>
        <div className="form-field">
          <label className="form-label">Overline</label>
          <input name="heroOverline" required defaultValue={row.heroOverline} className="form-input" />
        </div>
        <div className="form-field">
          <label className="form-label">Title</label>
          <input name="heroTitle" required defaultValue={row.heroTitle} className="form-input" />
        </div>
        <div className="form-field">
          <label className="form-label">Body</label>
          <textarea name="heroBody" required rows={5} defaultValue={row.heroBody} className="form-input" />
        </div>
        <div className="form-field">
          <label className="form-label">Primary CTA label</label>
          <input name="ctaLabel" required defaultValue={row.ctaLabel} className="form-input" />
        </div>
        <div className="form-field">
          <label className="form-label">Primary CTA href</label>
          <input name="ctaHref" required defaultValue={row.ctaHref} className="form-input" />
        </div>
        <h2 className="pt-4 text-sm font-medium uppercase tracking-wider text-text-tertiary">Intro</h2>
        <div className="form-field">
          <label className="form-label">Intro title</label>
          <input name="introTitle" required defaultValue={row.introTitle} className="form-input" />
        </div>
        <div className="form-field">
          <label className="form-label">Intro body</label>
          <textarea name="introBody" required rows={5} defaultValue={row.introBody} className="form-input" />
        </div>
        <h2 className="pt-4 text-sm font-medium uppercase tracking-wider text-text-tertiary">Focus</h2>
        <div className="form-field">
          <label className="form-label">Focus section title</label>
          <input name="focusTitle" required defaultValue={row.focusTitle} className="form-input" />
        </div>
        <div className="form-field">
          <label className="form-label">Focus bullets (JSON array of strings)</label>
          <textarea
            name="focusBullets"
            required
            rows={10}
            defaultValue={prettyJson(row.focusBullets)}
            className="form-input font-mono text-xs"
            spellCheck={false}
          />
        </div>
        <h2 className="pt-4 text-sm font-medium uppercase tracking-wider text-text-tertiary">Differentiator</h2>
        <div className="form-field">
          <label className="form-label">Title</label>
          <input name="differentiatorTitle" required defaultValue={row.differentiatorTitle} className="form-input" />
        </div>
        <div className="form-field">
          <label className="form-label">Body</label>
          <textarea name="differentiatorBody" required rows={6} defaultValue={row.differentiatorBody} className="form-input" />
        </div>
        <button type="submit" className="btn btn-primary mt-4 w-fit">
          Save
        </button>
      </form>
    </div>
  );
}
