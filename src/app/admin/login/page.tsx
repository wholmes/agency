import { redirect } from "next/navigation";
import { isAdminSession, isAdminPasswordConfigured } from "@/lib/admin/session";
import LoginForm from "./LoginForm";

export const metadata = {
  title: "Admin — Sign in",
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage() {
  if (await isAdminSession()) {
    redirect("/admin");
  }

  return (
    <div className="flex min-h-[calc(100dvh-var(--nav-height))] items-center justify-center bg-bg px-6 py-16">
      <div className="w-full max-w-sm rounded-lg border border-border bg-surface p-10">
        <h1 className="font-display mb-2 text-2xl font-light tracking-tight text-text-primary">Admin</h1>
        <p className="mb-8 text-sm text-text-secondary">Sign in to edit site content.</p>
        {!isAdminPasswordConfigured() ? (
          <p className="text-sm text-error">
            Set <code className="font-mono text-xs">ADMIN_PASSWORD</code> (at least 8 characters) in{" "}
            <code className="font-mono text-xs">.env</code>, then restart the dev server.
          </p>
        ) : (
          <LoginForm />
        )}
      </div>
    </div>
  );
}
