/**
 * Brand monogram: gold "B/C" in a circular ring, or letters-only for the expanding nav pill.
 */
export default function BrandLogoMark({
  variant = "nav",
  className = "",
}: {
  variant?: "nav" | "navInset" | "mini" | "footer" | "footerDark" | "admin" | "login";
  /** Extra classes on the outer wrapper */
  className?: string;
}) {
  const ring =
    variant === "nav"
      ? "size-8 border border-accent/50 text-accent"
      : variant === "navInset"
        ? "size-8 text-accent"
        : variant === "mini"
          ? "size-6 border border-[#c9a55a]/40 text-[#c9a55a]"
          : variant === "login"
            ? "size-9 border border-accent/50 text-accent"
            : variant === "admin"
              ? "size-7 border border-border text-accent"
              : variant === "footerDark"
                ? "size-7 border border-[#c9a55a]/40 text-[#c9a55a]"
                : "size-7 border border-accent/50 text-accent";

  const textSize =
    variant === "login"
      ? "text-[12px] tracking-[-0.06em]"
      : variant === "nav" || variant === "navInset"
        ? "text-[11px] tracking-[-0.07em]"
        : variant === "mini"
          ? "text-[9px] tracking-[-0.08em]"
          : "text-[10px] tracking-[-0.07em]";

  const slashMuted =
    variant === "footerDark" || variant === "mini"
      ? "text-[#c9a55a]/75"
      : "text-accent/80";

  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded-full ${ring} ${className}`}
      aria-hidden="true"
    >
      <span className={`font-mono font-semibold leading-none ${textSize}`}>
        B<span className={slashMuted}>/</span>C
      </span>
    </span>
  );
}
