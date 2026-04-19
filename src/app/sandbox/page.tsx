import type { Metadata } from "next";
import BlueprintDemo from "@/components/demos/BlueprintDemo";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
  title: "Sandbox",
};

export default function SandboxPage() {
  return (
    <div className="min-h-dvh bg-bg pt-[var(--nav-height)]">
      <div className="container py-16">
        <div className="mb-10 border-b border-border pb-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-text-tertiary">
            Internal sandbox — not indexed, not linked
          </p>
          <h1 className="font-display mt-2 text-3xl font-light tracking-tight">
            Component playground
          </h1>
        </div>

        <section className="mb-20">
          <h2 className="mb-6 text-sm font-medium uppercase tracking-wider text-text-tertiary">
            Blueprint Toolkit · Interactive Demo
          </h2>
          <BlueprintDemo />
        </section>
      </div>
    </div>
  );
}
