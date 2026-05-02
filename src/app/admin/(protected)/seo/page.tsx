import AdminSaveForm from "@/components/admin/AdminSaveForm";
import AdminToggle from "@/components/admin/AdminToggle";
import { prisma } from "@/lib/prisma";
import { updateSeoSettings } from "@/lib/admin/mutations-data";

export const metadata = { title: "Admin — SEO & Analytics" };

export default async function AdminSeoPage() {
  const s = await prisma.seoSettings.findUniqueOrThrow({ where: { id: 1 } });

  const hasGa = s.googleAnalyticsId.startsWith("G-");
  const hasGtm = s.googleTagManagerId.startsWith("GTM-");
  const hasApiSecret = s.googleAnalyticsApiSecret.length > 0;
  const serverSideActive = hasGa && hasApiSecret;

  return (
    <div className="mx-auto max-w-xl">
      <h1 className="font-display mb-2 text-2xl font-light tracking-tight">SEO &amp; Analytics</h1>
      <p className="mb-8 text-sm text-text-secondary">
        Changes take effect on the next page load. Analytics scripts are injected sitewide once a valid ID is saved.
      </p>

      <AdminSaveForm action={updateSeoSettings} className="flex flex-col gap-6">

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
          <div className="mt-4 flex flex-col gap-2">
            <AdminToggle
              id="noIndex"
              name="noIndex"
              label="Block search engine indexing"
              description="Adds noindex, nofollow — enable on staging, disable before going live"
              defaultChecked={s.noIndex}
            />
            {s.noIndex && (
              <p className="text-xs font-medium text-yellow-400 px-1">
                ⚠ Site is currently blocking search engines.
              </p>
            )}
          </div>
        </fieldset>

        {/* Google Analytics */}
        <fieldset className="rounded-lg border border-border p-5">
          <legend className="px-2 text-xs font-semibold uppercase tracking-wider text-text-tertiary">
            Google Analytics 4
          </legend>
          <p className="mb-4 rounded-md border border-border bg-surface-2/80 px-3 py-2.5 text-xs text-text-secondary">
            <strong className="text-text-primary">Ignore Google’s “install this code on every page” step.</strong> This site
            already loads the same gtag/GA4 tag from the Measurement ID you save here — do{" "}
            <strong>not</strong> paste a second snippet in Vercel, layout files, or Tag Assistant duplicates.
            If you use <strong>Tag Manager</strong> below, configure GA4 inside that GTM container; this app
            will load GTM only and skip the direct gtag block (on purpose, to avoid double hits).
          </p>
          <div className="mt-4 flex flex-col gap-4">
            {/* Status row */}
            {(hasGa || hasGtm) && (
              <div className="flex flex-wrap gap-2">
                {hasGa && !hasGtm && (
                  <span className="rounded-full border border-green-700/40 bg-green-950/30 px-2.5 py-1 text-[11px] font-medium text-green-400">
                    ✓ Client-side tracking active
                  </span>
                )}
                {serverSideActive && (
                  <span className="rounded-full border border-green-700/40 bg-green-950/30 px-2.5 py-1 text-[11px] font-medium text-green-400">
                    ✓ Server-side tracking active
                  </span>
                )}
                {hasGa && hasGtm && (
                  <span className="rounded-full border border-border px-2.5 py-1 text-[11px] text-text-tertiary">
                    GA4 script suppressed — using GTM
                  </span>
                )}
              </div>
            )}

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
                Google Analytics → Admin → Data Streams → your stream.
              </p>
            </div>

            <div className="form-field">
              <label className="form-label" htmlFor="googleAnalyticsApiSecret">
                Measurement Protocol API Secret
              </label>
              <input
                id="googleAnalyticsApiSecret"
                name="googleAnalyticsApiSecret"
                type="password"
                autoComplete="off"
                defaultValue={s.googleAnalyticsApiSecret}
                className="form-input font-mono text-sm"
                placeholder="••••••••••••••••"
              />
              <p className="mt-1 text-xs text-text-tertiary">
                Required for server-side event tracking (contact form leads, etc.).
                GA4 → Admin → Data Streams → your stream → Measurement Protocol → <strong className="text-text-secondary">Create API Secret</strong>.
                Leave blank to disable server-side tracking.
              </p>
            </div>

            {hasGa && !hasApiSecret && (
              <div className="rounded-md border border-yellow-700/30 bg-yellow-950/20 px-4 py-3 text-xs text-yellow-300">
                <strong>Add an API Secret</strong> to enable server-side tracking — form submissions and other server events will appear in GA4 alongside client-side page views.
              </div>
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
              <div className="flex flex-col gap-2">
                <p className="text-xs font-medium text-green-400">✓ GTM is active</p>
                <p className="rounded-md border border-border bg-surface-2/80 px-3 py-2.5 text-xs text-text-secondary">
                  <strong className="text-text-primary">Meta Pixel:</strong> install only inside GTM (Meta tag template). Do not load the pixel separately in env or layout — avoid duplicate fires.
                  On internal navigations the site pushes{" "}
                  <code className="font-mono text-[11px]">virtual_page_view</code> to{" "}
                  <code className="font-mono text-[11px]">dataLayer</code>. In GTM add a trigger{" "}
                  <strong className="text-text-secondary">Custom Event</strong> name{" "}
                  <code className="font-mono text-[11px]">virtual_page_view</code> and attach your Meta{" "}
                  <strong className="text-text-secondary">Page View</strong> (and GA4 page_view if you route GA4 through GTM too).
                </p>
              </div>
            )}
          </div>
        </fieldset>

        <button type="submit" className="btn btn-primary w-fit">
          Save
        </button>
      </AdminSaveForm>
    </div>
  );
}
