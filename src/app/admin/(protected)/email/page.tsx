import { prisma } from "@/lib/prisma";
import { updateEmailSettings } from "@/lib/admin/mutations-data";

export const metadata = { title: "Admin — Email settings" };

export default async function AdminEmailPage() {
  const s = await prisma.emailSettings.findUniqueOrThrow({ where: { id: 1 } });
  const hasApiKey = !!(process.env.RESEND_API_KEY && process.env.RESEND_API_KEY !== "re_YOUR_KEY_HERE");

  return (
    <div className="mx-auto max-w-xl">
      <h1 className="font-display mb-2 text-2xl font-light tracking-tight">Email settings</h1>
      <p className="mb-8 text-sm text-text-secondary">
        Configure where contact form submissions are delivered and how replies are sent.
      </p>

      {/* API key status banner */}
      <div
        className={`mb-8 flex items-start gap-3 rounded-lg border px-4 py-3 text-sm ${
          hasApiKey
            ? "border-green-700/40 bg-green-950/30 text-green-300"
            : "border-yellow-600/40 bg-yellow-950/40 text-yellow-300"
        }`}
      >
        <span className="mt-0.5 text-base leading-none" aria-hidden="true">
          {hasApiKey ? "✓" : "⚠"}
        </span>
        <span>
          {hasApiKey ? (
            <>
              <strong>Resend API key detected</strong> — emails are active.
            </>
          ) : (
            <>
              <strong>No Resend API key found.</strong> Set{" "}
              <code className="font-mono text-xs">RESEND_API_KEY</code> in your environment
              variables (Vercel → Settings → Environment Variables) to enable email delivery.{" "}
              <a
                href="https://resend.com/api-keys"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-yellow-200"
              >
                Get a free key at resend.com
              </a>
              .
            </>
          )}
        </span>
      </div>

      <form action={updateEmailSettings} className="flex flex-col gap-6">
        {/* Delivery */}
        <fieldset className="rounded-lg border border-border p-5">
          <legend className="px-2 text-xs font-semibold uppercase tracking-wider text-text-tertiary">
            Delivery
          </legend>
          <div className="mt-4 flex flex-col gap-4">
            <div className="form-field">
              <label className="form-label" htmlFor="notifyEmail">
                Notification address
              </label>
              <input
                id="notifyEmail"
                name="notifyEmail"
                type="email"
                required
                defaultValue={s.notifyEmail}
                className="form-input"
                placeholder="hello@brandmeetscode.com"
              />
              <p className="mt-1 text-xs text-text-tertiary">
                New form submissions are delivered here.
              </p>
            </div>
          </div>
        </fieldset>

        {/* Sender identity */}
        <fieldset className="rounded-lg border border-border p-5">
          <legend className="px-2 text-xs font-semibold uppercase tracking-wider text-text-tertiary">
            Sender identity
          </legend>
          <div className="mt-4 flex flex-col gap-4">
            <div className="form-field">
              <label className="form-label" htmlFor="fromName">
                From name
              </label>
              <input
                id="fromName"
                name="fromName"
                type="text"
                required
                defaultValue={s.fromName}
                className="form-input"
                placeholder="BrandMeetsCode"
              />
            </div>
            <div className="form-field">
              <label className="form-label" htmlFor="fromAddress">
                From address
              </label>
              <input
                id="fromAddress"
                name="fromAddress"
                type="email"
                required
                defaultValue={s.fromAddress}
                className="form-input"
                placeholder="noreply@brandmeetscode.com"
              />
              <p className="mt-1 text-xs text-text-tertiary">
                Must be a{" "}
                <a
                  href="https://resend.com/domains"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent underline"
                >
                  verified Resend domain
                </a>
                . Use{" "}
                <code className="font-mono">onboarding@resend.dev</code> for testing until your
                domain is verified.
              </p>
            </div>
          </div>
        </fieldset>

        {/* Auto-reply */}
        <fieldset className="rounded-lg border border-border p-5">
          <legend className="px-2 text-xs font-semibold uppercase tracking-wider text-text-tertiary">
            Auto-reply
          </legend>
          <div className="mt-4 flex flex-col gap-4">
            <div className="form-field flex items-center gap-3">
              <input
                id="autoReplyEnabled"
                name="autoReplyEnabled"
                type="checkbox"
                defaultChecked={s.autoReplyEnabled}
                className="size-4 rounded border-border accent-accent"
              />
              <label htmlFor="autoReplyEnabled" className="text-sm text-text-primary">
                Send an auto-reply to the person who submitted the form
              </label>
            </div>
            <div className="form-field">
              <label className="form-label" htmlFor="autoReplySubject">
                Subject line
              </label>
              <input
                id="autoReplySubject"
                name="autoReplySubject"
                type="text"
                required
                defaultValue={s.autoReplySubject}
                className="form-input"
              />
            </div>
            <div className="form-field">
              <label className="form-label" htmlFor="autoReplyOpening">
                Opening message
              </label>
              <textarea
                id="autoReplyOpening"
                name="autoReplyOpening"
                rows={3}
                required
                defaultValue={s.autoReplyOpening}
                className="form-input"
              />
              <p className="mt-1 text-xs text-text-tertiary">
                Shown as the main paragraph of the auto-reply email.
              </p>
            </div>
          </div>
        </fieldset>

        <button type="submit" className="btn btn-primary w-fit">
          Save
        </button>
      </form>
    </div>
  );
}
