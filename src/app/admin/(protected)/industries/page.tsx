import Link from "next/link";
import AdminSaveForm from "@/components/admin/AdminSaveForm";
import { prisma } from "@/lib/prisma";
import { updateIndustriesHub } from "@/lib/admin/mutations-data";

export const metadata = { title: "Admin — Industries" };

export default async function AdminIndustriesListPage() {
  const [hub, industries] = await Promise.all([
    prisma.industriesHub.findUniqueOrThrow({ where: { id: 1 } }),
    prisma.industryPage.findMany({ orderBy: { sortOrder: "asc" } }),
  ]);

  return (
    <div className="mx-auto max-w-2xl space-y-14">
      <section>
        <h2 className="mb-4 text-sm font-medium uppercase tracking-wider text-text-tertiary">/industries hub</h2>
        <p className="mb-6 text-sm text-text-secondary">
          Public listing at <code className="font-mono text-xs">/industries</code> — overline, headline, intro, SEO, and the link label on each industry card.
        </p>
        <AdminSaveForm action={updateIndustriesHub} className="flex flex-col gap-4" successMessage="Hub saved">
          <div className="form-field">
            <label className="form-label">Meta title</label>
            <input name="metaTitle" required defaultValue={hub.metaTitle} className="form-input" />
          </div>
          <div className="form-field">
            <label className="form-label">Meta description</label>
            <textarea name="metaDescription" required rows={3} defaultValue={hub.metaDescription} className="form-input" />
          </div>
          <div className="form-field">
            <label className="form-label">Overline</label>
            <input name="overline" required defaultValue={hub.overline} className="form-input" />
          </div>
          <div className="form-field">
            <label className="form-label">Headline</label>
            <input name="headline" required defaultValue={hub.headline} className="form-input" />
          </div>
          <div className="form-field">
            <label className="form-label">Intro body</label>
            <textarea name="introBody" required rows={4} defaultValue={hub.introBody} className="form-input" />
          </div>
          <div className="form-field">
            <label className="form-label">Card link label</label>
            <input name="cardCtaLabel" required defaultValue={hub.cardCtaLabel} className="form-input" />
          </div>
          <button type="submit" className="btn btn-primary w-fit">
            Save hub
          </button>
        </AdminSaveForm>
      </section>

      <div>
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="font-display mb-2 text-2xl font-light tracking-tight">Industry pages</h1>
            <p className="text-sm text-text-secondary">
              Vertical pages at <code className="font-mono text-xs">/industries/[slug]</code>. Edit copy per page or add a new vertical below.
            </p>
          </div>
          <Link href="/admin/industries/new" className="btn btn-primary w-fit shrink-0">
            New industry
          </Link>
        </div>
      {industries.length === 0 ? (
        <p className="rounded-lg border border-dashed border-border bg-surface px-5 py-8 text-center text-sm text-text-secondary">
          No industry pages yet. Create one to add <code className="font-mono text-xs">/industries/[slug]</code> to the site.
        </p>
      ) : (
        <ul className="divide-y divide-border rounded-lg border border-border bg-surface">
          {industries.map((row) => (
            <li key={row.slug}>
              <Link
                href={`/admin/industries/${encodeURIComponent(row.slug)}`}
                className="flex items-center justify-between gap-4 px-5 py-4 no-underline transition-colors hover:bg-surface-2"
              >
                <span>
                  <span className="font-medium text-text-primary">{row.listTitle}</span>
                  <span className="ml-2 text-xs text-text-tertiary">{row.slug}</span>
                </span>
                <span className="text-xs text-text-tertiary">→</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
      </div>
    </div>
  );
}
