import { prisma } from "@/lib/prisma";
import {
  updateAboutPageHero,
  updateAboutStoryParagraph,
  updateAboutStorySection,
  updateAboutValue,
  updateAboutValuesSectionHeader,
} from "@/lib/admin/mutations-data";

export const metadata = { title: "Admin — About page" };

export default async function AdminAboutPage() {
  const [hero, storySection, paragraphs, valuesHeader, values] = await Promise.all([
    prisma.aboutPageHero.findUniqueOrThrow({ where: { id: 1 } }),
    prisma.aboutStorySection.findUniqueOrThrow({ where: { id: 1 } }),
    prisma.aboutStoryParagraph.findMany({ orderBy: { sortOrder: "asc" } }),
    prisma.aboutValuesSectionHeader.findUniqueOrThrow({ where: { id: 1 } }),
    prisma.aboutValue.findMany({ orderBy: { sortOrder: "asc" } }),
  ]);

  return (
    <div className="mx-auto max-w-2xl space-y-16">
      <h1 className="font-display text-2xl font-light tracking-tight">About page</h1>

      <section>
        <h2 className="mb-4 text-sm font-medium uppercase tracking-wider text-text-tertiary">Hero</h2>
        <form action={updateAboutPageHero} className="flex flex-col gap-4">
          <div className="form-field">
            <label className="form-label">Overline</label>
            <input name="overline" required defaultValue={hero.overline} className="form-input" />
          </div>
          <div className="form-field">
            <label className="form-label">Line 1</label>
            <input name="line1" required defaultValue={hero.line1} className="form-input" />
          </div>
          <div className="form-field">
            <label className="form-label">Line 2</label>
            <input name="line2" required defaultValue={hero.line2} className="form-input" />
          </div>
          <div className="form-field">
            <label className="form-label">Line 3 (before emphasis)</label>
            <input name="line3BeforeEm" required defaultValue={hero.line3BeforeEm} className="form-input" />
          </div>
          <div className="form-field">
            <label className="form-label">Line 3 emphasis</label>
            <input name="line3Em" required defaultValue={hero.line3Em} className="form-input" />
          </div>
          <div className="form-field">
            <label className="form-label">Body</label>
            <textarea name="body" required rows={5} defaultValue={hero.body} className="form-input" />
          </div>
          <button type="submit" className="btn btn-primary w-fit">
            Save hero
          </button>
        </form>
      </section>

      <section>
        <h2 className="mb-4 text-sm font-medium uppercase tracking-wider text-text-tertiary">Story column</h2>
        <form action={updateAboutStorySection} className="flex flex-col gap-4">
          <div className="form-field">
            <label className="form-label">Heading (before emphasis)</label>
            <input name="headingBeforeEm" required defaultValue={storySection.headingBeforeEm} className="form-input" />
          </div>
          <div className="form-field">
            <label className="form-label">Heading emphasis</label>
            <input name="headingEm" required defaultValue={storySection.headingEm} className="form-input" />
          </div>
          <div className="form-field">
            <label className="form-label">Heading (after emphasis)</label>
            <input name="headingAfterEm" required defaultValue={storySection.headingAfterEm} className="form-input" />
          </div>
          <div className="form-field">
            <label className="form-label">BMC monogram text</label>
            <input name="bmcMonogram" required defaultValue={storySection.bmcMonogram} className="form-input" />
          </div>
          <div className="form-field">
            <label className="form-label">BMC tagline</label>
            <input name="bmcTagline" required defaultValue={storySection.bmcTagline} className="form-input" />
          </div>
          <button type="submit" className="btn btn-primary w-fit">
            Save story header
          </button>
        </form>

        <div className="mt-10 space-y-8">
          <h3 className="text-sm font-medium text-text-secondary">Paragraphs</h3>
          {paragraphs.map((para) => (
            <form key={para.id} action={updateAboutStoryParagraph} className="rounded-lg border border-border bg-surface p-5">
              <input type="hidden" name="id" value={para.id} />
              <div className="form-field">
                <label className="form-label">Body</label>
                <textarea name="body" required rows={5} defaultValue={para.body} className="form-input" />
              </div>
              <div className="form-field">
                <label className="form-label">Sort order</label>
                <input name="sortOrder" type="number" required defaultValue={para.sortOrder} className="form-input" />
              </div>
              <button type="submit" className="btn btn-secondary text-xs">
                Save paragraph
              </button>
            </form>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-sm font-medium uppercase tracking-wider text-text-tertiary">Values</h2>
        <form action={updateAboutValuesSectionHeader} className="mb-10 flex flex-col gap-4">
          <div className="form-field">
            <label className="form-label">Overline</label>
            <input name="overline" required defaultValue={valuesHeader.overline} className="form-input" />
          </div>
          <div className="form-field">
            <label className="form-label">Heading</label>
            <input name="heading" required defaultValue={valuesHeader.heading} className="form-input" />
          </div>
          <button type="submit" className="btn btn-primary w-fit">
            Save values header
          </button>
        </form>

        <div className="space-y-8">
          {values.map((v) => (
            <form key={v.id} action={updateAboutValue} className="rounded-lg border border-border bg-surface p-5">
              <input type="hidden" name="id" value={v.id} />
              <div className="form-field">
                <label className="form-label">Title</label>
                <input name="title" required defaultValue={v.title} className="form-input" />
              </div>
              <div className="form-field">
                <label className="form-label">Body</label>
                <textarea name="body" required rows={4} defaultValue={v.body} className="form-input" />
              </div>
              <div className="form-field">
                <label className="form-label">Sort order</label>
                <input name="sortOrder" type="number" required defaultValue={v.sortOrder} className="form-input" />
              </div>
              <button type="submit" className="btn btn-secondary text-xs">
                Save value
              </button>
            </form>
          ))}
        </div>
      </section>
    </div>
  );
}
