import { prisma } from "@/lib/prisma";
import {
  updateFeaturedTestimonial,
  updateSocialClient,
  updateSocialStat,
} from "@/lib/admin/mutations-data";

export const metadata = { title: "Admin — Social proof" };

export default async function AdminSocialPage() {
  const [testimonial, stats, clients] = await Promise.all([
    prisma.featuredTestimonial.findUniqueOrThrow({ where: { id: 1 } }),
    prisma.socialStat.findMany({ orderBy: { sortOrder: "asc" } }),
    prisma.socialClient.findMany({ orderBy: { sortOrder: "asc" } }),
  ]);

  return (
    <div className="mx-auto max-w-2xl space-y-16">
      <div>
        <h1 className="font-display mb-8 text-2xl font-light tracking-tight">Social proof</h1>
        <h2 className="mb-4 text-sm font-medium uppercase tracking-wider text-text-tertiary">Featured testimonial</h2>
        <form action={updateFeaturedTestimonial} className="flex flex-col gap-4">
          <div className="form-field">
            <label className="form-label" htmlFor="quote">
              Quote
            </label>
            <textarea id="quote" name="quote" required rows={4} defaultValue={testimonial.quote} className="form-input" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="form-field">
              <label className="form-label" htmlFor="authorName">
                Author name
              </label>
              <input id="authorName" name="authorName" type="text" required defaultValue={testimonial.authorName} className="form-input" />
            </div>
            <div className="form-field">
              <label className="form-label" htmlFor="authorTitle">
                Author title
              </label>
              <input id="authorTitle" name="authorTitle" type="text" required defaultValue={testimonial.authorTitle} className="form-input" />
            </div>
            <div className="form-field">
              <label className="form-label" htmlFor="authorInitials">
                Initials
              </label>
              <input id="authorInitials" name="authorInitials" type="text" required defaultValue={testimonial.authorInitials} className="form-input" />
            </div>
            <div className="form-field">
              <label className="form-label" htmlFor="starCount">
                Stars (1–5)
              </label>
              <input
                id="starCount"
                name="starCount"
                type="number"
                min={1}
                max={5}
                required
                defaultValue={testimonial.starCount}
                className="form-input"
              />
            </div>
          </div>
          <button type="submit" className="btn btn-primary w-fit">
            Save testimonial
          </button>
        </form>
      </div>

      <div>
        <h2 className="mb-4 text-sm font-medium uppercase tracking-wider text-text-tertiary">Stats bar</h2>
        <div className="space-y-8">
          {stats.map((s) => (
            <form key={s.id} action={updateSocialStat} className="rounded-lg border border-border bg-surface p-5">
              <input type="hidden" name="id" value={s.id} />
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="form-field">
                  <label className="form-label">Value</label>
                  <input name="value" type="text" required defaultValue={s.value} className="form-input" />
                </div>
                <div className="form-field sm:col-span-2">
                  <label className="form-label">Label</label>
                  <input name="label" type="text" required defaultValue={s.label} className="form-input" />
                </div>
                <div className="form-field">
                  <label className="form-label">Sort order</label>
                  <input name="sortOrder" type="number" required defaultValue={s.sortOrder} className="form-input" />
                </div>
              </div>
              <button type="submit" className="btn btn-secondary mt-3 text-xs">
                Save stat
              </button>
            </form>
          ))}
        </div>
      </div>

      <div>
        <h2 className="mb-4 text-sm font-medium uppercase tracking-wider text-text-tertiary">Client logos / names</h2>
        <div className="space-y-8">
          {clients.map((c) => (
            <form key={c.id} action={updateSocialClient} className="rounded-lg border border-border bg-surface p-5">
              <input type="hidden" name="id" value={c.id} />
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="form-field">
                  <label className="form-label">Name</label>
                  <input name="name" type="text" required defaultValue={c.name} className="form-input" />
                </div>
                <div className="form-field">
                  <label className="form-label">Sort order</label>
                  <input name="sortOrder" type="number" required defaultValue={c.sortOrder} className="form-input" />
                </div>
                <div className="form-field sm:col-span-2">
                  <label className="form-label">Context line</label>
                  <input name="context" type="text" required defaultValue={c.context} className="form-input" />
                </div>
              </div>
              <button type="submit" className="btn btn-secondary mt-3 text-xs">
                Save client
              </button>
            </form>
          ))}
        </div>
      </div>
    </div>
  );
}
