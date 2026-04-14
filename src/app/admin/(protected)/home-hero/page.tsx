import AdminSaveForm from "@/components/admin/AdminSaveForm";
import { UtmOptionalBlock } from "@/components/admin/UtmOptionalBlock";
import { prisma } from "@/lib/prisma";
import { updateHomeHero } from "../mutations";

export const metadata = { title: "Admin — Home hero" };

export default async function AdminHomeHeroPage() {
  const h = await prisma.homeHero.findUniqueOrThrow({ where: { id: 1 } });

  return (
    <div className="mx-auto max-w-xl">
      <h1 className="font-display mb-8 text-2xl font-light tracking-tight">Home hero</h1>
      <AdminSaveForm action={updateHomeHero} className="flex flex-col gap-5">
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

        <UtmOptionalBlock
          title="GA4 — UTM parameters (optional)"
          description={
            <>
              Leave <strong className="text-text-primary">CTA href</strong> as a clean path (e.g.{" "}
              <code className="text-text-primary/90">/contact</code>). Put <code className="text-text-primary/90">utm_*</code>{" "}
              values here — they are appended when the homepage renders. Empty fields are omitted.
            </>
          }
          fieldNames={{
            source: "primaryUtmSource",
            medium: "primaryUtmMedium",
            campaign: "primaryUtmCampaign",
            content: "primaryUtmContent",
            term: "primaryUtmTerm",
          }}
          values={{
            source: h.primaryUtmSource,
            medium: h.primaryUtmMedium,
            campaign: h.primaryUtmCampaign,
            content: h.primaryUtmContent,
            term: h.primaryUtmTerm,
          }}
        >
          <p className="text-text-secondary mb-3 text-xs font-medium uppercase tracking-wide">Primary CTA</p>
        </UtmOptionalBlock>

        <UtmOptionalBlock
          title="Secondary CTA — UTM (optional)"
          fieldNames={{
            source: "secondaryUtmSource",
            medium: "secondaryUtmMedium",
            campaign: "secondaryUtmCampaign",
            content: "secondaryUtmContent",
            term: "secondaryUtmTerm",
          }}
          values={{
            source: h.secondaryUtmSource,
            medium: h.secondaryUtmMedium,
            campaign: h.secondaryUtmCampaign,
            content: h.secondaryUtmContent,
            term: h.secondaryUtmTerm,
          }}
        />

        <button type="submit" className="btn btn-primary w-fit">
          Save
        </button>
      </AdminSaveForm>
    </div>
  );
}
