import { prisma } from "@/lib/prisma";
import { updateContactPageCopy } from "@/lib/admin/mutations-data";
import ContactFormEditor from "./ContactFormEditor";

export const metadata = { title: "Admin — Contact" };

function prettyJson(s: string): string {
  try {
    return JSON.stringify(JSON.parse(s), null, 2);
  } catch {
    return s;
  }
}

export default async function AdminContactPage() {
  const [copy, formConfig] = await Promise.all([
    prisma.contactPageCopy.findUniqueOrThrow({ where: { id: 1 } }),
    prisma.contactFormConfig.findUniqueOrThrow({ where: { id: 1 } }),
  ]);

  return (
    <div className="mx-auto max-w-2xl space-y-16">
      <h1 className="font-display text-2xl font-light tracking-tight">Contact page</h1>

      <section>
        <h2 className="mb-4 text-sm font-medium uppercase tracking-wider text-text-tertiary">Page copy</h2>
        <form action={updateContactPageCopy} className="flex flex-col gap-4">
          <div className="form-field">
            <label className="form-label">Meta title</label>
            <input name="metaTitle" required defaultValue={copy.metaTitle} className="form-input" />
          </div>
          <div className="form-field">
            <label className="form-label">Meta description</label>
            <textarea name="metaDescription" required rows={3} defaultValue={copy.metaDescription} className="form-input" />
          </div>
          <div className="form-field">
            <label className="form-label">Overline</label>
            <input name="overline" required defaultValue={copy.overline} className="form-input" />
          </div>
          <div className="form-field">
            <label className="form-label">Hero line (before emphasis)</label>
            <input name="heroLineBeforeEm" required defaultValue={copy.heroLineBeforeEm} className="form-input" />
          </div>
          <div className="form-field">
            <label className="form-label">Hero emphasis</label>
            <input name="heroEmphasis" required defaultValue={copy.heroEmphasis} className="form-input" />
          </div>
          <div className="form-field">
            <label className="form-label">Hero line (after emphasis)</label>
            <input name="heroLineAfterEm" required defaultValue={copy.heroLineAfterEm} className="form-input" />
          </div>
          <div className="form-field">
            <label className="form-label">Intro paragraph</label>
            <textarea name="introParagraph" required rows={4} defaultValue={copy.introParagraph} className="form-input" />
          </div>
          <div className="form-field">
            <label className="form-label">&ldquo;What happens next&rdquo; heading</label>
            <input name="whatHappensHeading" required defaultValue={copy.whatHappensHeading} className="form-input" />
          </div>
          <div className="form-field">
            <label className="form-label">Next steps (JSON array of strings)</label>
            <textarea
              name="nextSteps"
              required
              rows={8}
              defaultValue={prettyJson(copy.nextSteps)}
              className="form-input font-mono text-xs"
              spellCheck={false}
            />
          </div>
          <div className="form-field">
            <label className="form-label">Alternate routes heading</label>
            <input name="altRoutesHeading" required defaultValue={copy.altRoutesHeading} className="form-input" />
          </div>
          <div className="form-field">
            <label className="form-label">Email card title</label>
            <input name="emailCardTitle" required defaultValue={copy.emailCardTitle} className="form-input" />
          </div>
          <div className="form-field">
            <label className="form-label">Calendar card title</label>
            <input name="calendarCardTitle" required defaultValue={copy.calendarCardTitle} className="form-input" />
          </div>
          <div className="form-field">
            <label className="form-label">Calendar card subtitle</label>
            <input name="calendarCardSubtitle" required defaultValue={copy.calendarCardSubtitle} className="form-input" />
          </div>
          <div className="form-field">
            <label className="form-label">Calendly URL</label>
            <input name="calendlyUrl" required defaultValue={copy.calendlyUrl} className="form-input" />
          </div>
          <button type="submit" className="btn btn-primary w-fit">
            Save copy
          </button>
        </form>
      </section>

      <section>
        <h2 className="mb-4 text-sm font-medium uppercase tracking-wider text-text-tertiary">Form labels &amp; options</h2>
        <ContactFormEditor initialJson={prettyJson(formConfig.configJson)} />
      </section>
    </div>
  );
}
