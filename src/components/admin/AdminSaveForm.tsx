"use client";

import { useAdminToast } from "./AdminToast";

function isNextRedirect(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "digest" in error &&
    typeof (error as { digest?: string }).digest === "string" &&
    String((error as { digest: string }).digest).startsWith("NEXT_REDIRECT")
  );
}

type Props = {
  action: (formData: FormData) => Promise<void>;
  children: React.ReactNode;
  className?: string;
  /** Shown after a successful save (default: "Saved") */
  successMessage?: string;
};

/**
 * Wraps a server action form: shows a success toast after save, or an error toast on failure.
 * Redirects from server actions are ignored (no error toast).
 */
export default function AdminSaveForm({
  action,
  children,
  className,
  successMessage = "Saved",
}: Props) {
  const { success, error } = useAdminToast();

  async function wrappedAction(formData: FormData) {
    try {
      await action(formData);
      success(successMessage);
    } catch (e) {
      if (isNextRedirect(e)) return;
      console.error(e);
      error("Couldn’t save. Try again.");
    }
  }

  return (
    <form action={wrappedAction} className={className}>
      {children}
    </form>
  );
}
