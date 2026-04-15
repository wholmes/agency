import Link from "next/link";
import CreateCapabilityForm from "./CreateCapabilityForm";

export const metadata = { title: "Admin — New capability" };

export default function NewCapabilityPage() {
  return (
    <div className="mx-auto max-w-xl">
      <div className="mb-8 flex items-center gap-4">
        <Link href="/admin/capabilities" className="text-sm text-text-tertiary hover:text-text-primary">
          ← Capabilities
        </Link>
        <h1 className="font-display text-2xl font-light tracking-tight">New capability card</h1>
      </div>
      <CreateCapabilityForm />
    </div>
  );
}
