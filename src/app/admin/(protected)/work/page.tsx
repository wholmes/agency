import AdminSaveForm from "@/components/admin/AdminSaveForm";
import { prisma } from "@/lib/prisma";
import { updateCaseStudyUiLabels, updateWorkPageHero, updateWorkPreviewSection } from "@/lib/admin/mutations-data";

export const metadata = { title: "Admin — Work pages" };

export default async function AdminWorkContentPage() {
  const [workHero, preview, labels] = await Promise.all([
    prisma.workPageHero.findUniqueOrThrow({ where: { id: 1 } }),
    prisma.workPreviewSection.findUniqueOrThrow({ where: { id: 1 } }),
    prisma.caseStudyUiLabels.findUniqueOrThrow({ where: { id: 1 } }),
  ]);

  return (
    <div className="mx-auto max-w-2xl space-y-16">
      <section>
        <h1 className="font-display mb-8 text-2xl font-light tracking-tight">Work listing</h1>
        <h2 className="mb-4 text-sm font-medium uppercase tracking-wider text-text-tertiary">/work hero</h2>
        <AdminSaveForm action={updateWorkPageHero} className="flex flex-col gap-4" successMessage="Work hero saved">
          <div className="form-field">
            <label className="form-label">Overline</label>
            <input name="overline" type="text" required defaultValue={workHero.overline} className="form-input" />
          </div>
          <div className="form-field">
            <label className="form-label">Headline line 1</label>
            <input name="headlineLine1" type="text" required defaultValue={workHero.headlineLine1} className="form-input" />
          </div>
          <div className="form-field">
            <label className="form-label">Headline italic</label>
            <input name="headlineLine2Italic" type="text" required defaultValue={workHero.headlineLine2Italic} className="form-input" />
          </div>
          <div className="form-field">
            <label className="form-label">Body</label>
            <textarea name="body" required rows={3} defaultValue={workHero.body} className="form-input" />
          </div>
          <button type="submit" className="btn btn-primary w-fit">
            Save work hero
          </button>
        </AdminSaveForm>
      </section>

      <section>
        <h2 className="mb-4 text-sm font-medium uppercase tracking-wider text-text-tertiary">Home — work preview strip</h2>
        <AdminSaveForm action={updateWorkPreviewSection} className="flex flex-col gap-4" successMessage="Preview section saved">
          <div className="form-field">
            <label className="form-label">Overline</label>
            <input name="overline" type="text" required defaultValue={preview.overline} className="form-input" />
          </div>
          <div className="form-field">
            <label className="form-label">Heading line 1</label>
            <input name="headingLine1" type="text" required defaultValue={preview.headingLine1} className="form-input" />
          </div>
          <div className="form-field">
            <label className="form-label">Heading emphasis</label>
            <input name="headingEmphasis" type="text" required defaultValue={preview.headingEmphasis} className="form-input" />
          </div>
          <button type="submit" className="btn btn-primary w-fit">
            Save preview section
          </button>
        </AdminSaveForm>
      </section>

      <section>
        <h2 className="mb-4 text-sm font-medium uppercase tracking-wider text-text-tertiary">Case study template labels</h2>
        <AdminSaveForm action={updateCaseStudyUiLabels} className="flex flex-col gap-4" successMessage="Labels saved">
          {(
            [
              ["backToWorkLabel", "Back to work link"],
              ["backToCaseStudiesLabel", "Back to case studies"],
              ["problemSectionLabel", "Problem section"],
              ["approachSectionLabel", "Approach section"],
              ["outcomeSectionLabel", "Outcome section"],
              ["similarProjectCtaLabel", "Bottom CTA"],
            ] as const
          ).map(([name, label]) => (
            <div key={name} className="form-field">
              <label className="form-label" htmlFor={name}>
                {label}
              </label>
              <input
                id={name}
                name={name}
                type="text"
                required
                defaultValue={labels[name as keyof typeof labels] as string}
                className="form-input"
              />
            </div>
          ))}
          <button type="submit" className="btn btn-primary w-fit">
            Save labels
          </button>
        </AdminSaveForm>
      </section>
    </div>
  );
}
