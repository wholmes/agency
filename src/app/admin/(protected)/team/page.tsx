import Link from "next/link";
import { getAllTeamMembersForAdmin } from "@/lib/cms/queries";
import { moveTeamMemberUp, moveTeamMemberDown } from "@/lib/admin/mutations-data";

export const metadata = { title: "Admin — Team" };

export default async function TeamAdminPage() {
  const members = await getAllTeamMembersForAdmin();

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="font-display text-2xl font-light tracking-tight">Team</h1>
        <Link href="/admin/team/new" className="btn btn-primary text-sm">
          + New member
        </Link>
      </div>

      {members.length === 0 ? (
        <p className="text-sm text-text-tertiary">No team members yet. Add one above.</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {members.map((m) => (
            <li
              key={m.id}
              className="flex items-center gap-4 rounded-lg border border-border bg-surface px-5 py-4"
            >
              <div className="flex flex-col gap-0.5 items-center">
                <form action={moveTeamMemberUp.bind(null, m.id)}>
                  <button type="submit" className="text-text-tertiary hover:text-text-primary text-xs leading-none">▲</button>
                </form>
                <form action={moveTeamMemberDown.bind(null, m.id)}>
                  <button type="submit" className="text-text-tertiary hover:text-text-primary text-xs leading-none">▼</button>
                </form>
              </div>

              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-accent-muted bg-accent-subtle font-display text-base font-light text-accent">
                {m.name.charAt(0)}
              </div>

              <div className="flex-1 min-w-0">
                <p className="truncate text-sm font-medium text-text-primary">{m.name}</p>
                <p className="truncate font-mono text-[10px] tracking-wider text-accent">{m.role}</p>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <span className="font-mono text-[10px] text-text-tertiary">
                  B{m.brandCodeBalance} / C{100 - m.brandCodeBalance}
                </span>
                {m.featured && (
                  <span className="rounded border border-accent-muted px-1.5 py-0.5 font-mono text-[9px] tracking-wider text-accent">Featured</span>
                )}
                <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${m.published ? "bg-green-900/40 text-green-400" : "bg-surface-2 text-text-tertiary"}`}>
                  {m.published ? "Live" : "Draft"}
                </span>
                <Link href={`/admin/team/${m.id}`} className="text-sm text-text-tertiary hover:text-text-primary">
                  Edit →
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
