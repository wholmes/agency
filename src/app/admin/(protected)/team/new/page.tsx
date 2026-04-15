import Link from "next/link";
import CreateTeamMemberForm from "./CreateTeamMemberForm";

export const metadata = { title: "Admin — New team member" };

export default function NewTeamMemberPage() {
  return (
    <div className="mx-auto max-w-xl">
      <div className="mb-8 flex items-center gap-4">
        <Link href="/admin/team" className="text-sm text-text-tertiary hover:text-text-primary">
          ← Team
        </Link>
        <h1 className="font-display text-2xl font-light tracking-tight">New team member</h1>
      </div>
      <CreateTeamMemberForm />
    </div>
  );
}
