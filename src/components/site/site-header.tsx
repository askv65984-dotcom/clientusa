"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type CSSProperties } from "react";
import { mainNav } from "@/lib/site";
import { LogoMark } from "./logo";

function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SiteHeader() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const solid = scrolled || open;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        solid ? "border-b border-line bg-night/80 backdrop-blur-xl" : "border-b border-transparent bg-transparent"
      }`}
    >
      <div aria-hidden="true" className="scroll-progress absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-gold" />
      <div className={`page-container flex items-center justify-between gap-6 transition-[min-height] duration-500 ${solid ? "min-h-[4.5rem]" : "min-h-[5.75rem]"}`}>
        <Link href="/" className="inline-flex items-center gap-3 text-fg no-underline" aria-label="Anoka Advisors, home">
          <LogoMark className="size-9 shrink-0" />
          <span className="font-serif text-[1.45rem] leading-none font-medium tracking-[-0.01em]">Anoka Advisors</span>
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-9 lg:flex">
          <ul className="flex items-center gap-8">
            {mainNav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isActive(pathname, item.href) ? "page" : undefined}
                  className="group relative py-2 text-[0.975rem] font-medium text-fg/85 no-underline transition-colors hover:text-fg aria-[current=page]:text-gold"
                >
                  {item.label}
                  <span
                    aria-hidden="true"
                    className="absolute -bottom-0.5 left-0 h-px w-full origin-left scale-x-0 bg-gold transition-transform duration-300 group-hover:scale-x-100 group-aria-[current=page]:scale-x-100"
                  />
                </Link>
              </li>
            ))}
          </ul>
          <Link href="/book" className="btn btn-gold min-h-11 px-5">
            Book a consultation
          </Link>
        </nav>

        <button
          type="button"
          className="relative z-50 inline-flex min-h-11 items-center gap-2.5 rounded-full border border-line-strong px-4 text-[0.975rem] font-semibold text-fg lg:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((value) => !value)}
        >
          <span className="relative block h-3 w-5" aria-hidden="true">
            <span className={`absolute left-0 h-0.5 w-5 bg-current transition-all duration-300 ${open ? "top-[5px] rotate-45" : "top-0"}`} />
            <span className={`absolute left-0 h-0.5 w-5 bg-current transition-all duration-300 ${open ? "top-[5px] -rotate-45" : "top-2.5"}`} />
          </span>
          {open ? "Close" : "Menu"}
        </button>
      </div>

      <div
        id="mobile-menu"
        hidden={!open}
        className="fixed inset-x-0 top-[4.5rem] bottom-0 overflow-y-auto border-t border-line bg-night/97 backdrop-blur-xl lg:hidden"
      >
        <nav aria-label="Main" className="page-container flex min-h-full flex-col py-8">
          <ul className="space-y-1">
            {mainNav.map((item, index) => (
              <li key={item.href} className="rise" style={{ "--d": `${index * 60}ms` } as CSSProperties}>
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  aria-current={pathname === item.href || (item.href !== "/" && isActive(pathname, item.href)) ? "page" : undefined}
                  className="flex items-center justify-between border-b border-line py-4 font-serif text-[2rem] text-fg no-underline aria-[current=page]:text-gold"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-auto pt-10">
            <Link href="/book" onClick={() => setOpen(false)} className="btn btn-gold w-full">
              Book a consultation
            </Link>
            <a href="mailto:info@anokaadvisors.com" className="mt-5 block text-center text-fg-muted">
              info@anokaadvisors.com
            </a>
          </div>
        </nav>
      </div>
    </header>
  );
}
