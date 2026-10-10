import Link from "next/link";

/**
 * The mark: two strokes leaning in to meet near the top, held by one crossbar.
 * The left stroke takes the text color, the right stroke is always gold.
 */
export function LogoMark({ className = "size-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" aria-hidden="true" focusable="false" className={className}>
      <path d="M7 35 L18.3 5.5" stroke="currentColor" strokeWidth="4.25" strokeLinecap="square" fill="none" />
      <path d="M21.7 5.5 L33 35" stroke="var(--color-gold)" strokeWidth="4.25" strokeLinecap="square" fill="none" />
      <path d="M12.6 24.5 H27.4" stroke="currentColor" strokeWidth="3.25" fill="none" />
    </svg>
  );
}

export function Logo({ tone = "dark" }: { tone?: "dark" | "light" }) {
  const color = tone === "dark" ? "text-evergreen" : "text-paper";
  return (
    <Link
      href="/"
      className={`inline-flex items-center gap-2.5 no-underline ${color}`}
      aria-label="Anoka Advisors, home"
    >
      <LogoMark className="size-8 shrink-0" />
      <span className="font-serif text-[1.375rem] leading-none font-medium tracking-[-0.01em]">
        Anoka Advisors
      </span>
    </Link>
  );
}
