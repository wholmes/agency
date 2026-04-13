import type { Metadata } from "next";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="admin-root min-h-dvh bg-bg pt-[var(--nav-height)] text-text-primary">
      {children}
    </div>
  );
}
