import Link from "next/link";
import { notFound } from "next/navigation";
import AdminSaveForm from "@/components/admin/AdminSaveForm";
import AdminToggle from "@/components/admin/AdminToggle";
import CaseStudyImageUpload from "@/components/admin/CaseStudyImageUpload";
import { IconExternalLink } from "@/components/icons";
import { prisma } from "@/lib/prisma";
import { updateProject } from "../../mutations";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const p = await prisma.project.findUnique({ where: { id } });
  return { title: p ? `Admin — ${p.title}` : "Admin — Project" };
}

export default async function AdminProjectEditPage({ params }: Props) {
  const { id } = await params;
  const p = await prisma.project.findUnique({ where: { id } });
  if (!p) notFound();

  let servicesPretty = p.services;
  try {
    servicesPretty = JSON.stringify(JSON.parse(p.services), null, 2);
  } catch {
    /* keep raw string */
  }

  const updateWithId = updateProject.bind(null, id);

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <h1 className="font-display mb-1 text-2xl font-light tracking-tight">{p.title}</h1>
          <p className="font-mono text-xs text-text-tertiary">id: {p.id}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {!p.published && (
            <span className="rounded-full border border-yellow-700/50 bg-yellow-950/40 px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider text-yellow-400">
              Draft
            </span>
          )}
          <Link
            href={`/work/${p.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-secondary inline-flex items-center gap-2 text-sm"
          >
            <IconExternalLink size={14} />
            Open live page
          </Link>
          <Link
            href="/admin/projects"
            className="text-sm text-text-tertiary no-underline hover:text-text-secondary"
          >
            ← All projects
          </Link>
        </div>
      </div>

      <AdminSaveForm action={updateWithId} className="flex flex-col gap-5">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div className="form-field sm:col-span-2">
            <label className="form-label" htmlFor="title">
              Title
            </label>
            <input id="title" name="title" type="text" required defaultValue={p.title} className="form-input" />
          </div>
          <div className="form-field">
            <label className="form-label" htmlFor="category">
              Category
            </label>
            <input id="category" name="category" type="text" required defaultValue={p.category} className="form-input" />
          </div>
          <div className="form-field">
            <label className="form-label" htmlFor="year">
              Year
            </label>
            <input id="year" name="year" type="text" required defaultValue={p.year} className="form-input" />
          </div>
          <div className="form-field sm:col-span-2">
            <label className="form-label" htmlFor="proofFit">
              Proof line
            </label>
            <input id="proofFit" name="proofFit" type="text" required defaultValue={p.proofFit} className="form-input" />
          </div>
          <div className="form-field">
            <label className="form-label" htmlFor="result">
              Result headline
            </label>
            <input id="result" name="result" type="text" required defaultValue={p.result} className="form-input" />
          </div>
          <div className="form-field">
            <label className="form-label" htmlFor="resultDetail">
              Result detail
            </label>
            <input
              id="resultDetail"
              name="resultDetail"
              type="text"
              required
              defaultValue={p.resultDetail}
              className="form-input"
            />
          </div>
          <div className="form-field">
            <label className="form-label" htmlFor="color">
              Hero color (hex)
            </label>
            <input id="color" name="color" type="text" required defaultValue={p.color} className="form-input" />
          </div>
          <div className="form-field">
            <label className="form-label" htmlFor="accent">
              Accent (hex)
            </label>
            <input id="accent" name="accent" type="text" required defaultValue={p.accent} className="form-input" />
          </div>
          <div className="form-field">
            <label className="form-label" htmlFor="sortOrder">
              Sort order
            </label>
            <input
              id="sortOrder"
              name="sortOrder"
              type="number"
              required
              defaultValue={p.sortOrder}
              className="form-input"
            />
          </div>
        </div>
        <div className="form-field">
          <label className="form-label" htmlFor="problem">
            Problem
          </label>
          <textarea id="problem" name="problem" required rows={4} defaultValue={p.problem} className="form-input" />
        </div>
        <div className="form-field">
          <label className="form-label" htmlFor="approach">
            Approach
          </label>
          <textarea id="approach" name="approach" required rows={4} defaultValue={p.approach} className="form-input" />
        </div>
        <div className="form-field">
          <label className="form-label" htmlFor="outcome">
            Outcome
          </label>
          <textarea id="outcome" name="outcome" required rows={4} defaultValue={p.outcome} className="form-input" />
        </div>
        <div className="form-field">
          <label className="form-label" htmlFor="services">
            Services (JSON array of strings)
          </label>
          <textarea
            id="services"
            name="services"
            required
            rows={4}
            defaultValue={servicesPretty}
            className="form-input font-mono text-xs"
            spellCheck={false}
          />
        </div>
        {/* Images */}
        <div className="rounded-lg border border-border p-5">
          <p className="mb-5 text-xs font-semibold uppercase tracking-wider text-text-tertiary">Images</p>
          <CaseStudyImageUpload
            thumbImage={p.thumbImage}
            coverImage={p.coverImage}
            heroImage={p.heroImage}
          />
        </div>

        <AdminToggle id="published" name="published" label="Published" description="Visible on the public work page" defaultChecked={p.published} />

        <button type="submit" className="btn btn-primary w-fit">
          Save
        </button>
      </AdminSaveForm>
    </div>
  );
}
