import Link from "next/link";
import { IconArrowRight } from "@/components/icons";

export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center px-6 text-center">
      {/* Decorative number */}
      <p
        aria-hidden="true"
        className="font-display pointer-events-none select-none text-[clamp(6rem,20vw,14rem)] font-extralight leading-none tracking-tight text-accent opacity-10"
      >
        404
      </p>

      <div className="-mt-4 max-w-[420px]">
        <h1 className="font-display mb-4 text-2xl font-light tracking-tight text-text-primary">
          Page not found
        </h1>
        <p className="mb-10 text-sm leading-relaxed text-text-secondary">
          The page you're looking for doesn't exist or has moved. Let's get you back on track.
        </p>

        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/" className="btn btn-primary">
            Back to home
            <IconArrowRight size={15} />
          </Link>
          <Link href="/work" className="btn btn-secondary">
            See our work
          </Link>
        </div>
      </div>

      {/* Subtle links row */}
      <nav
        aria-label="Helpful links"
        className="mt-16 flex flex-wrap justify-center gap-x-8 gap-y-2"
      >
        {[
          { href: "/services", label: "Services" },
          { href: "/industries", label: "Industries" },
          { href: "/about", label: "About" },
          { href: "/contact", label: "Contact" },
        ].map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="text-xs tracking-wide text-text-tertiary no-underline transition-colors hover:text-text-primary"
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
