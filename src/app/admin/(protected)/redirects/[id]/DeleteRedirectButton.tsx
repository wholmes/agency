"use client";

import AdminSaveForm from "@/components/admin/AdminSaveForm";

interface Props {
  action: (formData: FormData) => Promise<void>;
  source: string;
}

export default function DeleteRedirectButton({ action, source }: Props) {
  return (
    <AdminSaveForm action={action} className="contents" successMessage="Deleted">
      <button
        type="submit"
        className="rounded-md border px-4 py-2 text-xs font-medium text-error transition-colors hover:bg-error/10"
        style={{ borderColor: "var(--color-error)" }}
        onClick={(e) => {
          if (!confirm(`Delete redirect for "${source}"? This cannot be undone.`)) {
            e.preventDefault();
          }
        }}
      >
        Delete redirect
      </button>
    </AdminSaveForm>
  );
}
