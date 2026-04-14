import AdminSaveForm from "@/components/admin/AdminSaveForm";
import { prisma } from "@/lib/prisma";
import {
  updateContinuityBlock,
  updateLighthouseGuarantee,
  updateScopeEstimatorConfig,
  updateServicesContinuityIntro,
  updateServicesHomeSection,
  updateServicesPageHero,
} from "@/lib/admin/mutations-data";

export const metadata = { title: "Admin — Services content" };

function prettyJson(s: string): string {
  try {
    return JSON.stringify(JSON.parse(s), null, 2);
  } catch {
    return s;
  }
}

export default async function AdminServicesContentPage() {
  const [pageHero, homeSection, continuityIntro, guarantee, blocks, scope] = await Promise.all([
    prisma.servicesPageHero.findUniqueOrThrow({ where: { id: 1 } }),
    prisma.servicesHomeSection.findUniqueOrThrow({ where: { id: 1 } }),
    prisma.servicesContinuityIntro.findUniqueOrThrow({ where: { id: 1 } }),
    prisma.lighthouseGuarantee.findUniqueOrThrow({ where: { id: 1 } }),
    prisma.continuityBlock.findMany({ orderBy: { sortOrder: "asc" } }),
    prisma.scopeEstimatorConfig.findUniqueOrThrow({ where: { id: 1 } }),
  ]);

  return (
    <div className="mx-auto max-w-2xl space-y-16">
      <h1 className="font-display text-2xl font-light tracking-tight">Services pages</h1>

      <section>
        <h2 className="mb-4 text-sm font-medium uppercase tracking-wider text-text-tertiary">/services hero</h2>
        <AdminSaveForm action={updateServicesPageHero} className="flex flex-col gap-4">
          <div className="form-field">
            <label className="form-label">Overline</label>
            <input name="overline" required defaultValue={pageHero.overline} className="form-input" />
          </div>
          <div className="form-field">
            <label className="form-label">Title</label>
            <input name="title" required defaultValue={pageHero.title} className="form-input" />
          </div>
          <div className="form-field">
            <label className="form-label">Body</label>
            <textarea name="body" required rows={4} defaultValue={pageHero.body} className="form-input" />
          </div>
          <button type="submit" className="btn btn-primary w-fit">
            Save
          </button>
        </AdminSaveForm>
      </section>

      <section>
        <h2 className="mb-4 text-sm font-medium uppercase tracking-wider text-text-tertiary">Home — services strip</h2>
        <AdminSaveForm action={updateServicesHomeSection} className="flex flex-col gap-4">
          <div className="form-field">
            <label className="form-label">Overline</label>
            <input name="overline" required defaultValue={homeSection.overline} className="form-input" />
          </div>
          <div className="form-field">
            <label className="form-label">Heading line 1</label>
            <input name="headingLine1" required defaultValue={homeSection.headingLine1} className="form-input" />
          </div>
          <div className="form-field">
            <label className="form-label">Heading emphasis</label>
            <input name="headingEmphasis" required defaultValue={homeSection.headingEmphasis} className="form-input" />
          </div>
          <div className="form-field">
            <label className="form-label">Footer before highlight</label>
            <input name="footerBeforeHighlight" required defaultValue={homeSection.footerBeforeHighlight} className="form-input" />
          </div>
          <div className="form-field">
            <label className="form-label">Footer highlight</label>
            <input name="footerHighlight" required defaultValue={homeSection.footerHighlight} className="form-input" />
          </div>
          <div className="form-field">
            <label className="form-label">After highlight, before link</label>
            <input name="footerAfterHighlightBeforeLink" required defaultValue={homeSection.footerAfterHighlightBeforeLink} className="form-input" />
          </div>
          <div className="form-field">
            <label className="form-label">Footer link label</label>
            <input name="footerLinkLabel" required defaultValue={homeSection.footerLinkLabel} className="form-input" />
          </div>
          <div className="form-field">
            <label className="form-label">Footer link href</label>
            <input name="footerLinkHref" required defaultValue={homeSection.footerLinkHref} className="form-input" />
          </div>
          <div className="form-field">
            <label className="form-label">After link</label>
            <input name="footerAfterLink" required defaultValue={homeSection.footerAfterLink} className="form-input" />
          </div>
          <button type="submit" className="btn btn-primary w-fit">
            Save
          </button>
        </AdminSaveForm>
      </section>

      <section>
        <h2 className="mb-4 text-sm font-medium uppercase tracking-wider text-text-tertiary">Scope &amp; continuity intro</h2>
        <AdminSaveForm action={updateServicesContinuityIntro} className="flex flex-col gap-4">
          <div className="form-field">
            <label className="form-label">Overline</label>
            <input name="overline" required defaultValue={continuityIntro.overline} className="form-input" />
          </div>
          <div className="form-field">
            <label className="form-label">Heading</label>
            <input name="heading" required defaultValue={continuityIntro.heading} className="form-input" />
          </div>
          <div className="form-field">
            <label className="form-label">Body</label>
            <textarea name="body" required rows={4} defaultValue={continuityIntro.body} className="form-input" />
          </div>
          <button type="submit" className="btn btn-primary w-fit">
            Save
          </button>
        </AdminSaveForm>
      </section>

      <section>
        <h2 className="mb-4 text-sm font-medium uppercase tracking-wider text-text-tertiary">Continuity blocks</h2>
        <div className="space-y-8">
          {blocks.map((b) => (
            <AdminSaveForm key={b.id} action={updateContinuityBlock} className="rounded-lg border border-border bg-surface p-5" successMessage="Block saved">
              <input type="hidden" name="id" value={b.id} />
              <div className="form-field">
                <label className="form-label">Title</label>
                <input name="title" required defaultValue={b.title} className="form-input" />
              </div>
              <div className="form-field">
                <label className="form-label">Body</label>
                <textarea name="body" required rows={4} defaultValue={b.body} className="form-input" />
              </div>
              <div className="form-field">
                <label className="form-label">Sort order</label>
                <input name="sortOrder" type="number" required defaultValue={b.sortOrder} className="form-input" />
              </div>
              <button type="submit" className="btn btn-secondary text-xs">
                Save block
              </button>
            </AdminSaveForm>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-sm font-medium uppercase tracking-wider text-text-tertiary">Lighthouse guarantee</h2>
        <AdminSaveForm action={updateLighthouseGuarantee} className="flex flex-col gap-4">
          <div className="form-field">
            <label className="form-label">Title</label>
            <input name="title" required defaultValue={guarantee.title} className="form-input" />
          </div>
          <div className="form-field">
            <label className="form-label">Body</label>
            <textarea name="body" required rows={4} defaultValue={guarantee.body} className="form-input" />
          </div>
          <button type="submit" className="btn btn-primary w-fit">
            Save
          </button>
        </AdminSaveForm>
      </section>

      <section>
        <h2 className="mb-4 text-sm font-medium uppercase tracking-wider text-text-tertiary">Ballpark estimator</h2>
        <AdminSaveForm action={updateScopeEstimatorConfig} className="flex flex-col gap-4">
          <div className="form-field">
            <label className="form-label">Section overline</label>
            <input name="sectionOverline" required defaultValue={scope.sectionOverline} className="form-input" />
          </div>
          <div className="form-field">
            <label className="form-label">Heading line 1</label>
            <input name="headingLine1" required defaultValue={scope.headingLine1} className="form-input" />
          </div>
          <div className="form-field">
            <label className="form-label">Heading line 2 (italic)</label>
            <input name="headingLine2Italic" required defaultValue={scope.headingLine2Italic} className="form-input" />
          </div>
          <div className="form-field">
            <label className="form-label">Intro body</label>
            <textarea name="body" required rows={3} defaultValue={scope.body} className="form-input" />
          </div>
          <div className="form-field">
            <label className="form-label">projectTypes (JSON)</label>
            <textarea name="projectTypes" required rows={8} defaultValue={prettyJson(scope.projectTypes)} className="form-input font-mono text-xs" spellCheck={false} />
          </div>
          <div className="form-field">
            <label className="form-label">pageCounts (JSON)</label>
            <textarea name="pageCounts" required rows={6} defaultValue={prettyJson(scope.pageCounts)} className="form-input font-mono text-xs" spellCheck={false} />
          </div>
          <div className="form-field">
            <label className="form-label">integrations (JSON)</label>
            <textarea name="integrations" required rows={8} defaultValue={prettyJson(scope.integrations)} className="form-input font-mono text-xs" spellCheck={false} />
          </div>
          <div className="form-field">
            <label className="form-label">timelines (JSON)</label>
            <textarea name="timelines" required rows={6} defaultValue={prettyJson(scope.timelines)} className="form-input font-mono text-xs" spellCheck={false} />
          </div>
          <div className="form-field">
            <label className="form-label">weeksByTimelineId (JSON)</label>
            <textarea name="weeksByTimelineId" required rows={6} defaultValue={prettyJson(scope.weeksByTimelineId)} className="form-input font-mono text-xs" spellCheck={false} />
          </div>
          <div className="form-field">
            <label className="form-label">stepTitles (JSON)</label>
            <textarea name="stepTitles" required rows={12} defaultValue={prettyJson(scope.stepTitles)} className="form-input font-mono text-xs" spellCheck={false} />
          </div>
          <div className="form-field">
            <label className="form-label">integrationsHint</label>
            <input name="integrationsHint" required defaultValue={scope.integrationsHint} className="form-input" />
          </div>
          <div className="form-field">
            <label className="form-label">resultOverline</label>
            <input name="resultOverline" required defaultValue={scope.resultOverline} className="form-input" />
          </div>
          <div className="form-field">
            <label className="form-label">resultDisclaimer</label>
            <textarea name="resultDisclaimer" required rows={3} defaultValue={scope.resultDisclaimer} className="form-input" />
          </div>
          <div className="form-field">
            <label className="form-label">stepTemplate</label>
            <input name="stepTemplate" required defaultValue={scope.stepTemplate} className="form-input" />
          </div>
          <button type="submit" className="btn btn-primary w-fit">
            Save estimator
          </button>
        </AdminSaveForm>
      </section>
    </div>
  );
}
