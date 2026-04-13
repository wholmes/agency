import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { updateServiceOffering } from "@/lib/admin/mutations-data";

interface Props {
  params: Promise<{ id: string }>;
}

function prettyJson(s: string): string {
  try {
    return JSON.stringify(JSON.parse(s), null, 2);
  } catch {
    return s;
  }
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const o = await prisma.serviceOffering.findUnique({ where: { id: Number(id) } });
  return { title: o ? `Admin — ${o.title}` : "Admin — Offering" };
}

export default async function AdminOfferingEditPage({ params }: Props) {
  const { id } = await params;
  const numId = Number(id);
  if (!Number.isFinite(numId)) notFound();

  const o = await prisma.serviceOffering.findUnique({ where: { id: numId } });
  if (!o) notFound();

  const save = updateServiceOffering.bind(null, o.id);

  return (
    <div className="mx-auto max-w-2xl space-y-10">
      <div>
        <p className="mb-1 text-xs text-text-tertiary">
          <Link href="/admin/offerings" className="text-text-secondary no-underline hover:text-text-primary">
            ← All offerings
          </Link>
        </p>
        <h1 className="font-display text-2xl font-light tracking-tight">{o.title}</h1>
      </div>

      <form action={save} className="flex flex-col gap-4">
        <div className="form-field">
          <label className="form-label">Slug (URL segment)</label>
          <input name="slug" required defaultValue={o.slug} className="form-input" />
        </div>
        <div className="form-field">
          <label className="form-label">Icon</label>
          <select name="iconKey" defaultValue={o.iconKey} className="form-input">
            <option value="design">design</option>
            <option value="code">code</option>
            <option value="brand">brand</option>
            <option value="analytics">analytics</option>
          </select>
        </div>
        <div className="form-field">
          <label className="form-label">Sort order</label>
          <input name="sortOrder" type="number" required defaultValue={o.sortOrder} className="form-input" />
        </div>
        <div className="form-field">
          <label className="form-label">Number (optional badge)</label>
          <input name="number" defaultValue={o.number ?? ""} className="form-input" placeholder="01" />
        </div>
        <div className="form-field">
          <label className="form-label">Title</label>
          <input name="title" required defaultValue={o.title} className="form-input" />
        </div>
        <div className="form-field">
          <label className="form-label">Subtitle</label>
          <input name="subtitle" defaultValue={o.subtitle ?? ""} className="form-input" />
        </div>
        <div className="form-field">
          <label className="form-label">Description (home)</label>
          <textarea name="descriptionHome" required rows={4} defaultValue={o.descriptionHome} className="form-input" />
        </div>
        <div className="form-field">
          <label className="form-label">Outcomes (home, JSON array of strings)</label>
          <textarea
            name="outcomesHome"
            required
            rows={8}
            defaultValue={prettyJson(o.outcomesHome)}
            className="form-input font-mono text-xs"
            spellCheck={false}
          />
        </div>
        <div className="form-field">
          <label className="form-label">Description (listing)</label>
          <textarea name="descriptionListing" required rows={4} defaultValue={o.descriptionListing} className="form-input" />
        </div>
        <div className="form-field">
          <label className="form-label">Outcomes (listing, JSON array)</label>
          <textarea
            name="outcomesListing"
            required
            rows={8}
            defaultValue={prettyJson(o.outcomesListing)}
            className="form-input font-mono text-xs"
            spellCheck={false}
          />
        </div>
        <div className="form-field">
          <label className="form-label">Detail page href</label>
          <input name="href" required defaultValue={o.href} className="form-input" />
        </div>
        <div className="flex items-center gap-2">
          <input type="checkbox" name="showOnHomepage" id="showOnHomepage" defaultChecked={o.showOnHomepage} className="rounded border-border" />
          <label htmlFor="showOnHomepage" className="text-sm text-text-secondary">
            Show on homepage
          </label>
        </div>
        <button type="submit" className="btn btn-primary w-fit">
          Save
        </button>
      </form>
    </div>
  );
}
