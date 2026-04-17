import { notFound } from "next/navigation";
import Link from "next/link";
import AdminSaveForm from "@/components/admin/AdminSaveForm";
import AdminToggle from "@/components/admin/AdminToggle";
import { prisma } from "@/lib/prisma";
import { updateCapability, deleteCapability } from "@/lib/admin/mutations-data";
import DeleteCapabilityButton from "./DeleteCapabilityButton";

export const metadata = { title: "Admin — Edit capability" };

export default async function EditCapabilityPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const cap = await prisma.capability.findUnique({ where: { id: Number(id) } });
  if (!cap) notFound();

  const save = updateCapability.bind(null, cap.id);
  const remove = deleteCapability.bind(null, cap.id);

  return (
    <div className="mx-auto max-w-xl">
      <div className="mb-8 flex items-center gap-4">
        <Link href="/admin/capabilities" className="text-sm text-text-tertiary hover:text-text-primary">
          ← Capabilities
        </Link>
        <h1 className="font-display text-2xl font-light tracking-tight">Edit: {cap.title}</h1>
      </div>

      <AdminSaveForm action={save} className="flex flex-col gap-5">
        <div className="form-field">
          <label className="form-label" htmlFor="title">Title</label>
          <input id="title" name="title" type="text" required defaultValue={cap.title} className="form-input" />
        </div>

        <div className="form-field">
          <label className="form-label" htmlFor="descriptor">Descriptor</label>
          <textarea id="descriptor" name="descriptor" rows={3} defaultValue={cap.descriptor} className="form-input" />
        </div>

        <div className="form-field">
          <label className="form-label" htmlFor="detail">Detail (fine print)</label>
          <textarea id="detail" name="detail" rows={3} defaultValue={cap.detail} className="form-input" />
        </div>

        <div className="form-field">
          <label className="form-label" htmlFor="tags">Tags</label>
          <input id="tags" name="tags" type="text" defaultValue={cap.tags} className="form-input" />
          <p className="mt-1 text-xs text-text-tertiary">Comma-separated. Aim for 6 tags.</p>
        </div>

        <div className="form-field">
          <label className="form-label" htmlFor="sortOrder">Sort order</label>
          <input id="sortOrder" name="sortOrder" type="number" defaultValue={cap.sortOrder} className="form-input w-24" />
        </div>

        <div className="form-field">
          <label className="form-label" htmlFor="iconSvg">Icon SVG</label>
          {cap.iconSvg && (
            <div className="mb-2 flex items-center gap-3 rounded border border-border bg-surface p-3">
              <span className="text-xs text-text-tertiary">Preview:</span>
              <span
                className="text-accent [&>svg]:h-6 [&>svg]:w-6"
                dangerouslySetInnerHTML={{ __html: cap.iconSvg }}
              />
            </div>
          )}
          <textarea
            id="iconSvg"
            name="iconSvg"
            rows={8}
            defaultValue={cap.iconSvg}
            className="form-input font-mono text-xs"
            placeholder={`<svg width="38" height="38" viewBox="0 0 24 24" fill="none" aria-hidden="true">\n  <path d="..." stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>\n</svg>`}
          />
          <p className="mt-1 text-xs text-text-tertiary">
            Use <code className="rounded bg-surface-2 px-1">currentColor</code> for stroke/fill. 24×24 viewBox, 1.5px stroke.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          <AdminToggle id="showTags" name="showTags" label="Show tags" description="Display skill tags on the card" defaultChecked={cap.showTags} />
          <AdminToggle id="published" name="published" label="Published" description="Visible on the site" defaultChecked={cap.published} />
        </div>

        <div className="flex items-center gap-4">
          <button type="submit" className="btn btn-primary w-fit">Save</button>
        </div>
      </AdminSaveForm>

      <div className="mt-10 border-t border-border pt-6">
        <DeleteCapabilityButton action={remove} title={cap.title} />
      </div>
    </div>
  );
}
