import { prisma } from "@/lib/prisma";
import { updateFooterCopy } from "../mutations";

export const metadata = { title: "Admin — Footer" };

export default async function AdminFooterPage() {
  const f = await prisma.footerCopy.findUniqueOrThrow({ where: { id: 1 } });

  return (
    <div className="mx-auto max-w-xl">
      <h1 className="font-display mb-8 text-2xl font-light tracking-tight">Footer</h1>
      <form action={updateFooterCopy} className="flex flex-col gap-5">
        <div className="form-field">
          <label className="form-label" htmlFor="tagline">
            Tagline
          </label>
          <textarea id="tagline" name="tagline" required rows={3} defaultValue={f.tagline} className="form-input" />
        </div>
        <div className="form-field">
          <label className="form-label" htmlFor="remoteBlurb">
            Remote blurb
          </label>
          <textarea
            id="remoteBlurb"
            name="remoteBlurb"
            required
            rows={4}
            defaultValue={f.remoteBlurb}
            className="form-input"
          />
        </div>
        <button type="submit" className="btn btn-primary w-fit">
          Save
        </button>
      </form>
    </div>
  );
}
