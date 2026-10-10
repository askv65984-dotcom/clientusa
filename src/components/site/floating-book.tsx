"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

/**
 * Gold "Book" button that floats in the bottom corner once the visitor scrolls past the hero.
 * Hidden on the booking page itself and during checkout, which has its own pay bar on phones.
 */
export function FloatingBook() {
  const pathname = usePathname();
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const onScroll = () => setShown(window.scrollY > 320);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (pathname === "/book" || pathname.startsWith("/checkout")) return null;

  return (
    <Link
      href="/book"
      aria-hidden={!shown}
      tabIndex={shown ? undefined : -1}
      className={`btn btn-gold fixed right-4 bottom-[max(1rem,env(safe-area-inset-bottom))] z-40 h-14 gap-2.5 px-6 text-base shadow-[0_18px_45px_-12px_rgba(0,0,0,0.75)] transition-[opacity,translate] duration-500 md:right-8 md:bottom-8 ${
        shown ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"
      }`}
    >
      <svg viewBox="0 0 20 20" aria-hidden="true" className="size-5">
        <rect x="3" y="4.5" width="14" height="12.5" rx="2" stroke="currentColor" strokeWidth="1.6" fill="none" />
        <path d="M3 8.5h14M7 2.75v3.5M13 2.75v3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" fill="none" />
      </svg>
      Book<span className="sr-only"> a consultation</span>
    </Link>
  );
}
