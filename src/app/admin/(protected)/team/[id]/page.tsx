import { notFound } from "next/navigation";
import Link from "next/link";
import AdminSaveForm from "@/components/admin/AdminSaveForm";
import PhotoUpload from "@/components/admin/PhotoUpload";
import { prisma } from "@/lib/prisma";
import { updateTeamMember, deleteTeamMember } from "@/lib/admin/mutations-data";
import DeleteTeamMemberButton from "./DeleteTeamMemberButton";

export const metadata = { title: "Admin — Edit team member" };

export default async function EditTeamMemberPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const member = await prisma.teamMember.findUnique({ where: { id: Number(id) } });
  if (!member) notFound();

  const save = updateTeamMember.bind(null, member.id);
  const remove = deleteTeamMember.bind(null, member.id);

  return (
    <div className="mx-auto max-w-xl">
      <div className="mb-8 flex items-center gap-4">
        <Link href="/admin/team" className="text-sm text-text-tertiary hover:text-text-primary">
          ← Team
        </Link>
        <h1 className="font-display text-2xl font-light tracking-tight">Edit: {member.name}</h1>
      </div>

      <AdminSaveForm action={save} className="flex flex-col gap-5">
        <div className="form-field">
          <label className="form-label" htmlFor="name">Name</label>
          <input id="name" name="name" type="text" required defaultValue={member.name} className="form-input" />
        </div>

        <div className="form-field">
          <label className="form-label" htmlFor="role">Role</label>
          <input id="role" name="role" type="text" required defaultValue={member.role} className="form-input" />
        </div>

        <div className="form-field">
          <label className="form-label" htmlFor="philosophy">Philosophy / tagline</label>
          <input id="philosophy" name="philosophy" type="text" defaultValue={member.philosophy} className="form-input" />
        </div>

        <div className="form-field">
          <label className="form-label" htmlFor="bio">Bio</label>
          <textarea id="bio" name="bio" rows={3} defaultValue={member.bio} className="form-input" />
        </div>

        <div className="form-field">
          <label className="form-label" htmlFor="skills">Skills</label>
          <input id="skills" name="skills" type="text" defaultValue={member.skills} className="form-input" />
          <p className="mt-1 text-xs text-text-tertiary">Comma-separated.</p>
        </div>

        <div className="form-field">
          <label className="form-label" htmlFor="brandCodeBalance">
            Brand / Code balance — <span className="text-accent">Brand %</span>
          </label>
          <input id="brandCodeBalance" name="brandCodeBalance" type="number" min="0" max="100" defaultValue={member.brandCodeBalance} className="form-input w-24" />
          <p className="mt-1 text-xs text-text-tertiary">0 = pure code, 100 = pure brand. Currently: Brand {member.brandCodeBalance}% / Code {100 - member.brandCodeBalance}%</p>
        </div>

        <div className="form-field">
          <label className="form-label" htmlFor="sortOrder">Sort order</label>
          <input id="sortOrder" name="sortOrder" type="number" defaultValue={member.sortOrder} className="form-input w-24" />
        </div>

        <div className="form-field">
          <label className="form-label">Headshot</label>
          <PhotoUpload currentUrl={member.photoUrl} />
        </div>

        <div className="form-field">
          <label className="form-label" htmlFor="capabilities">Radar chart capabilities</label>
          <textarea id="capabilities" name="capabilities" rows={4} defaultValue={member.capabilities} className="form-input font-mono text-xs" />
          <p className="mt-1 text-xs text-text-tertiary">Comma-separated as <code className="rounded bg-border/50 px-1">Name:Value</code> (0–100). E.g. <code className="rounded bg-border/50 px-1">Brand Strategy:92, Motion Design:78, React:88</code>. Use 5–8 items.</p>
        </div>

        <div className="flex flex-wrap gap-x-6 gap-y-3">
          <div className="form-field flex items-center gap-3">
            <input id="featured" name="featured" type="checkbox" defaultChecked={member.featured} className="size-4 rounded border-border accent-accent" />
            <label htmlFor="featured" className="text-sm text-text-primary">Featured (full-width card)</label>
          </div>
          <div className="form-field flex items-center gap-3">
            <input id="published" name="published" type="checkbox" defaultChecked={member.published} className="size-4 rounded border-border accent-accent" />
            <label htmlFor="published" className="text-sm text-text-primary">Published</label>
          </div>
          <div className="form-field flex items-center gap-3">
            <input id="showTags" name="showTags" type="checkbox" defaultChecked={member.showTags} className="size-4 rounded border-border accent-accent" />
            <label htmlFor="showTags" className="text-sm text-text-primary">Show skills pill</label>
          </div>
          <div className="form-field flex items-center gap-3">
            <input id="showBalance" name="showBalance" type="checkbox" defaultChecked={member.showBalance} className="size-4 rounded border-border accent-accent" />
            <label htmlFor="showBalance" className="text-sm text-text-primary">Show Brand / Code balance</label>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button type="submit" className="btn btn-primary w-fit">Save</button>
        </div>
      </AdminSaveForm>

      <div className="mt-10 border-t border-border pt-6">
        <DeleteTeamMemberButton action={remove} name={member.name} />
      </div>
    </div>
  );
}
