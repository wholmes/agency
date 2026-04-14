import AdminSaveForm from "@/components/admin/AdminSaveForm";
import { prisma } from "@/lib/prisma";
import {
  updateAboutHomeTeaser,
  updateAboutTeaserBelief,
  updateAboutTeaserCard,
} from "@/lib/admin/mutations-data";

export const metadata = { title: "Admin — Home about teaser" };

export default async function AdminHomeTeaserPage() {
  const [t, beliefs, teaserCard] = await Promise.all([
    prisma.aboutHomeTeaser.findUniqueOrThrow({ where: { id: 1 } }),
    prisma.aboutTeaserBelief.findMany({ orderBy: { sortOrder: "asc" } }),
    prisma.aboutTeaserCard.findUniqueOrThrow({ where: { id: 1 } }),
  ]);

  return (
    <div className="mx-auto max-w-xl space-y-16">
      <div>
        <h1 className="font-display mb-2 text-2xl font-light tracking-tight">Home — About teaser column</h1>
        <p className="mb-8 text-sm text-text-secondary">The “Difference” block on the homepage (not the full /about page).</p>
        <AdminSaveForm action={updateAboutHomeTeaser} className="flex flex-col gap-5">
        <div className="form-field">
          <label className="form-label" htmlFor="overline">
            Overline
          </label>
          <input id="overline" name="overline" type="text" required defaultValue={t.overline} className="form-input" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="form-field">
            <label className="form-label" htmlFor="headingBeforeEm">
              Heading before emphasis
            </label>
            <input id="headingBeforeEm" name="headingBeforeEm" type="text" required defaultValue={t.headingBeforeEm} className="form-input" />
          </div>
          <div className="form-field">
            <label className="form-label" htmlFor="headingEmphasis">
              Emphasis word
            </label>
            <input id="headingEmphasis" name="headingEmphasis" type="text" required defaultValue={t.headingEmphasis} className="form-input" />
          </div>
        </div>
        <div className="form-field">
          <label className="form-label" htmlFor="headingMid">
            Heading middle
          </label>
          <input id="headingMid" name="headingMid" type="text" required defaultValue={t.headingMid} className="form-input" />
        </div>
        <div className="form-field">
          <label className="form-label" htmlFor="headingLastLine">
            Last line
          </label>
          <input id="headingLastLine" name="headingLastLine" type="text" required defaultValue={t.headingLastLine} className="form-input" />
        </div>
        <div className="form-field">
          <label className="form-label" htmlFor="paragraph1">
            Paragraph 1
          </label>
          <textarea id="paragraph1" name="paragraph1" required rows={4} defaultValue={t.paragraph1} className="form-input" />
        </div>
        <div className="form-field">
          <label className="form-label" htmlFor="paragraph2">
            Paragraph 2
          </label>
          <textarea id="paragraph2" name="paragraph2" required rows={4} defaultValue={t.paragraph2} className="form-input" />
        </div>
        <button type="submit" className="btn btn-primary w-fit">
          Save
        </button>
      </AdminSaveForm>
      </div>

      <section>
        <h2 className="mb-4 text-sm font-medium uppercase tracking-wider text-text-tertiary">Belief chips</h2>
        <div className="space-y-6">
          {beliefs.map((b) => (
            <AdminSaveForm key={b.id} action={updateAboutTeaserBelief} className="rounded-lg border border-border bg-surface p-5" successMessage="Belief saved">
              <input type="hidden" name="id" value={b.id} />
              <div className="form-field">
                <label className="form-label">Text</label>
                <input name="text" required defaultValue={b.text} className="form-input" />
              </div>
              <div className="form-field">
                <label className="form-label">Sort order</label>
                <input name="sortOrder" type="number" required defaultValue={b.sortOrder} className="form-input" />
              </div>
              <button type="submit" className="btn btn-secondary text-xs">
                Save belief
              </button>
            </AdminSaveForm>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-sm font-medium uppercase tracking-wider text-text-tertiary">Teaser card</h2>
        <AdminSaveForm action={updateAboutTeaserCard} className="flex flex-col gap-4" successMessage="Teaser card saved">
          <div className="form-field">
            <label className="form-label">Body</label>
            <textarea name="body" required rows={4} defaultValue={teaserCard.body} className="form-input" />
          </div>
          <div className="form-field">
            <label className="form-label">CTA label</label>
            <input name="ctaLabel" required defaultValue={teaserCard.ctaLabel} className="form-input" />
          </div>
          <div className="form-field">
            <label className="form-label">CTA href</label>
            <input name="ctaHref" required defaultValue={teaserCard.ctaHref} className="form-input" />
          </div>
          <button type="submit" className="btn btn-primary w-fit">
            Save teaser card
          </button>
        </AdminSaveForm>
      </section>
    </div>
  );
}
