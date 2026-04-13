import { prisma } from "@/lib/prisma";
import { updateCtaSection } from "../mutations";

export const metadata = { title: "Admin — CTA section" };

export default async function AdminCtaPage() {
  const c = await prisma.ctaSectionCopy.findUniqueOrThrow({ where: { id: 1 } });

  return (
    <div className="mx-auto max-w-xl">
      <h1 className="font-display mb-8 text-2xl font-light tracking-tight">CTA section</h1>
      <p className="mb-8 text-sm text-text-secondary">
        Appears at the bottom of most pages (shared “Ready to start?” block).
      </p>
      <form action={updateCtaSection} className="flex flex-col gap-5">
        <div className="form-field">
          <label className="form-label" htmlFor="overline">
            Overline
          </label>
          <input id="overline" name="overline" type="text" required defaultValue={c.overline} className="form-input" />
        </div>
        <div className="form-field">
          <label className="form-label" htmlFor="headingBeforeEm">
            Heading (before emphasis)
          </label>
          <input
            id="headingBeforeEm"
            name="headingBeforeEm"
            type="text"
            required
            defaultValue={c.headingBeforeEm}
            className="form-input"
          />
        </div>
        <div className="form-field">
          <label className="form-label" htmlFor="headingEmphasis">
            Heading emphasis word
          </label>
          <input
            id="headingEmphasis"
            name="headingEmphasis"
            type="text"
            required
            defaultValue={c.headingEmphasis}
            className="form-input"
          />
        </div>
        <div className="form-field">
          <label className="form-label" htmlFor="body">
            Body
          </label>
          <textarea id="body" name="body" required rows={4} defaultValue={c.body} className="form-input" />
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div className="form-field">
            <label className="form-label" htmlFor="primaryCtaLabel">
              Primary CTA label
            </label>
            <input
              id="primaryCtaLabel"
              name="primaryCtaLabel"
              type="text"
              required
              defaultValue={c.primaryCtaLabel}
              className="form-input"
            />
          </div>
          <div className="form-field">
            <label className="form-label" htmlFor="primaryCtaHref">
              Primary CTA href
            </label>
            <input
              id="primaryCtaHref"
              name="primaryCtaHref"
              type="text"
              required
              defaultValue={c.primaryCtaHref}
              className="form-input"
            />
          </div>
          <div className="form-field">
            <label className="form-label" htmlFor="secondaryCtaLabel">
              Secondary CTA label
            </label>
            <input
              id="secondaryCtaLabel"
              name="secondaryCtaLabel"
              type="text"
              required
              defaultValue={c.secondaryCtaLabel}
              className="form-input"
            />
          </div>
          <div className="form-field">
            <label className="form-label" htmlFor="secondaryCtaHref">
              Secondary CTA href
            </label>
            <input
              id="secondaryCtaHref"
              name="secondaryCtaHref"
              type="text"
              required
              defaultValue={c.secondaryCtaHref}
              className="form-input"
            />
          </div>
        </div>
        <div className="form-field">
          <label className="form-label" htmlFor="footnote">
            Footnote
          </label>
          <input id="footnote" name="footnote" type="text" required defaultValue={c.footnote} className="form-input" />
        </div>
        <button type="submit" className="btn btn-primary w-fit">
          Save
        </button>
      </form>
    </div>
  );
}
