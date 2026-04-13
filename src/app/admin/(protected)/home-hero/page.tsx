import { prisma } from "@/lib/prisma";
import { updateHomeHero } from "../mutations";

export const metadata = { title: "Admin — Home hero" };

export default async function AdminHomeHeroPage() {
  const h = await prisma.homeHero.findUniqueOrThrow({ where: { id: 1 } });

  return (
    <div className="mx-auto max-w-xl">
      <h1 className="font-display mb-8 text-2xl font-light tracking-tight">Home hero</h1>
      <form action={updateHomeHero} className="flex flex-col gap-5">
        <div className="form-field">
          <label className="form-label" htmlFor="overline">
            Overline
          </label>
          <input id="overline" name="overline" type="text" required defaultValue={h.overline} className="form-input" />
        </div>
        <div className="form-field">
          <label className="form-label" htmlFor="headlineLine1">
            Headline line 1
          </label>
          <input
            id="headlineLine1"
            name="headlineLine1"
            type="text"
            required
            defaultValue={h.headlineLine1}
            className="form-input"
          />
        </div>
        <div className="form-field">
          <label className="form-label" htmlFor="headlineLine2Italic">
            Headline italic (middle)
          </label>
          <input
            id="headlineLine2Italic"
            name="headlineLine2Italic"
            type="text"
            required
            defaultValue={h.headlineLine2Italic}
            className="form-input"
          />
        </div>
        <div className="form-field">
          <label className="form-label" htmlFor="headlineLine3">
            Headline line 3
          </label>
          <input
            id="headlineLine3"
            name="headlineLine3"
            type="text"
            required
            defaultValue={h.headlineLine3}
            className="form-input"
          />
        </div>
        <div className="form-field">
          <label className="form-label" htmlFor="body">
            Body
          </label>
          <textarea id="body" name="body" required rows={4} defaultValue={h.body} className="form-input" />
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
              defaultValue={h.primaryCtaLabel}
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
              defaultValue={h.primaryCtaHref}
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
              defaultValue={h.secondaryCtaLabel}
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
              defaultValue={h.secondaryCtaHref}
              className="form-input"
            />
          </div>
        </div>
        <button type="submit" className="btn btn-primary w-fit">
          Save
        </button>
      </form>
    </div>
  );
}
