"use client";

import { useTransition } from "react";

export default function DeleteTeamMemberButton({
  action,
  name,
}: {
  action: () => Promise<void>;
  name: string;
}) {
  const [pending, startTransition] = useTransition();

  function handleClick() {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    startTransition(() => { action(); });
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={pending}
      className="text-sm text-red-400 underline-offset-2 hover:underline disabled:opacity-50"
    >
      {pending ? "Deleting…" : "Delete this member"}
    </button>
  );
}
