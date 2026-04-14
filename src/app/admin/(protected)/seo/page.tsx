import { prisma } from "@/lib/prisma";
import { updateSeoSettings } from "@/lib/admin/mutations-data";

export const metadata = { title: "Admin — SEO & Analytics" };

export default async function AdminSeoPage() {
  const s = await prisma.seoSettings.findUniqueOrThrow({ where: { id: 1 } });

  const hasGa = s.googleAnalyticsId.startsWith("G-");
  const hasGtm = s.googleTagManagerId.startsWith("GTM-");

  return (
    <div className="mx-auto max-w-xl">
      <h1 className="font-display mb-2 text-2xl font-light tracking-tight">SEO &amp; Analytics</h1>
      <p className="mb-8 text-sm text-text-secondary">
        Changes take effect on the next page load. Analytics scripts are injected sitewide once a valid ID is saved.
      </p>

      <form action={updateSeoSettings} className="flex flex-col gap-6">

        {/* Metadata */}
        <fieldset className="rounded-lg border border-border p-5">
          <legend className="px-2 text-xs font-semibold uppercase tracking-wider text-text-tertiary">
            Default metadata
          </legend>
          <div className="mt-4 flex flex-col gap-4">
            <div className="form-field">
              <label className="form-label" htmlFor="siteTitle">
                Site title
              </label>
              <input
                id="siteTitle"
                name="siteTitle"
                type="text"
                required
                defaultValue={s.siteTitle}
                className="form-input"
                placeholder="BrandMeetsCode — Premium Web Development Agency"
              />
              <p className="mt-1 text-xs text-text-tertiary">
                Used as the homepage <code className="font-mono">&lt;title&gt;</code> and OG title fallback.
              </p>
            </div>
            <div className="form-field">
              <label className="form-label" htmlFor="titleTemplate">
                Title template
              </label>
              <input
                id="titleTemplate"
                name="titleTemplate"
                type="text"
                required
                defaultValue={s.titleTemplate}
                className="form-input font-mono text-sm"
                placeholder="%s | BrandMeetsCode"
              />
              <p className="mt-1 text-xs text-text-tertiary">
                <code className="font-mono">%s</code> is replaced with the page-level title.
              </p>
            </div>
            <div className="form-field">
              <label className="form-label" htmlFor="metaDescription">
                Default meta description
              </label>
              <textarea
                id="metaDescription"
                name="metaDescription"
                rows={3}
                required
                defaultValue={s.metaDescription}
                className="form-input"
              />
              <p className="mt-1 text-xs text-text-tertiary">
                Used on pages without their own description. Keep under 160 characters for best results.
                {" "}<span className="tabular-nums text-accent">{s.metaDescription.length}/160</span>
              </p>
            </div>
          </div>
        </fieldset>

        {/* Indexing */}
        <fieldset className="rounded-lg border border-border p-5">
          <legend className="px-2 text-xs font-semibold uppercase tracking-wider text-text-tertiary">
            Indexing
          </legend>
          <div className="mt-4">
            <div className="form-field flex items-start gap-3">
              <input
                id="noIndex"
                name="noIndex"
                type="checkbox"
                defaultChecked={s.noIndex}
                className="mt-0.5 size-4 rounded border-border accent-accent"
              />
              <div>
                <label htmlFor="noIndex" className="text-sm text-text-primary">
                  Block all search engine indexing (noindex, nofollow)
                </label>
                <p className="mt-0.5 text-xs text-text-tertiary">
                  Enable on staging / pre-launch. Disable before going live.
                </p>
                {s.noIndex && (
                  <p className="mt-2 text-xs font-medium text-yellow-400">
                    ⚠ Site is currently blocking search engines.
                  </p>
                )}
              </div>
            </div>
          </div>
        </fieldset>

        {/* Google Analytics */}
        <fieldset className="rounded-lg border border-border p-5">
          <legend className="px-2 text-xs font-semibold uppercase tracking-wider text-text-tertiary">
            Google Analytics 4
          </legend>
          <div className="mt-4 flex flex-col gap-3">
            <div className="form-field">
              <label className="form-label" htmlFor="googleAnalyticsId">
                Measurement ID
              </label>
              <input
                id="googleAnalyticsId"
                name="googleAnalyticsId"
                type="text"
                defaultValue={s.googleAnalyticsId}
                className="form-input font-mono text-sm"
                placeholder="G-XXXXXXXXXX"
                pattern="^(G-[A-Z0-9]+)?$"
                title="Must start with G- or be empty"
              />
              <p className="mt-1 text-xs text-text-tertiary">
                Found in Google Analytics → Admin → Data Streams → your stream.
                Leave blank to disable.
              </p>
            </div>
            {hasGa && !hasGtm && (
              <p className="text-xs font-medium text-green-400">✓ GA4 is active</p>
            )}
            {hasGa && hasGtm && (
              <p className="text-xs text-text-tertiary">
                GTM is active — GA4 script is suppressed to avoid double-counting. Configure GA4 inside GTM instead.
              </p>
            )}
          </div>
        </fieldset>

        {/* Google Tag Manager */}
        <fieldset className="rounded-lg border border-border p-5">
          <legend className="px-2 text-xs font-semibold uppercase tracking-wider text-text-tertiary">
            Google Tag Manager
          </legend>
          <div className="mt-4 flex flex-col gap-3">
            <div className="form-field">
              <label className="form-label" htmlFor="googleTagManagerId">
                Container ID
              </label>
              <input
                id="googleTagManagerId"
                name="googleTagManagerId"
                type="text"
                defaultValue={s.googleTagManagerId}
                className="form-input font-mono text-sm"
                placeholder="GTM-XXXXXXX"
                pattern="^(GTM-[A-Z0-9]+)?$"
                title="Must start with GTM- or be empty"
              />
              <p className="mt-1 text-xs text-text-tertiary">
                Found in Google Tag Manager → your workspace. Use GTM when you need to manage multiple tags (GA4, Meta Pixel, LinkedIn, etc.) in one place.
                Leave blank to disable.
              </p>
            </div>
            {hasGtm && (
              <p className="text-xs font-medium text-green-400">✓ GTM is active</p>
            )}
          </div>
        </fieldset>

        <button type="submit" className="btn btn-primary w-fit">
          Save
        </button>
      </form>
    </div>
  );
}
