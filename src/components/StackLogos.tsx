import Image from "next/image";

const STACK = [
  { name: "Vercel", href: "https://vercel.com", src: "/logos/vercel.svg", className: "h-[14px] sm:h-4" },
  { name: "Supabase", href: "https://supabase.com", src: "/logos/supabase.svg", className: "h-[18px] sm:h-5" },
  { name: "Neon", href: "https://neon.tech", src: "/logos/neon.svg", className: "h-[17px] sm:h-[19px]" },
  { name: "Railway", href: "https://railway.app", src: "/logos/railway.svg", className: "h-[14px] sm:h-4" },
  { name: "WordPress", href: "https://wordpress.org", src: "/logos/wordpress.svg", className: "h-[17px] sm:h-[19px]" },
  { name: "Drupal", href: "https://www.drupal.org", src: "/logos/drupal.svg", className: "h-[18px] sm:h-5" },
  { name: "Webflow", href: "https://webflow.com", src: "/logos/webflow.svg", className: "h-[13px] sm:h-[15px]" },
  { name: "Squarespace", href: "https://www.squarespace.com", src: "/logos/squarespace.svg", className: "h-[16px] sm:h-[18px]" },
] as const;

export default function StackLogos() {
  return (
    <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
      <span className="font-mono text-[10px] tracking-[0.14em] text-text-tertiary uppercase">
        Stack
      </span>
      <ul className="flex flex-wrap items-center gap-x-7 gap-y-2" role="list">
        {STACK.map((item) => (
          <li key={item.name}>
            <a
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className="block opacity-55 transition-opacity [transition-duration:var(--duration-base)] [transition-timing-function:var(--ease-out)] hover:opacity-90"
            >
              <Image
                src={item.src}
                alt={item.name}
                width={120}
                height={24}
                unoptimized
                className={`w-auto max-w-[6.5rem] object-contain object-left ${item.className}`}
              />
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
