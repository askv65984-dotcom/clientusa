"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState, type CSSProperties } from "react";
import { BrandLogo } from "./logo";

export type NavLink = { href: string; label: string; description?: string };

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

function Chevron({ open }: { open: boolean }) {
  return (
    <svg viewBox="0 0 12 12" aria-hidden="true" className={`size-3 transition-transform duration-300 ${open ? "rotate-180" : ""}`}>
      <path d="M2.5 4.5L6 8l3.5-3.5" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const linkClass =
  "inline-flex h-10 items-center gap-1.5 rounded-full px-3.5 text-[0.975rem] font-medium text-fg/85 no-underline transition-colors hover:bg-white/[0.06] hover:text-fg aria-[current=page]:bg-white/[0.06] aria-[current=page]:text-gold xl:px-4";

/** A menu item that opens a panel of links on click, hover or keyboard focus. */
function NavMenu({
  label,
  href,
  links,
  footer,
  pathname,
}: {
  label: string;
  href: string;
  links: NavLink[];
  footer: NavLink;
  pathname: string;
}) {
  const [open, setOpen] = useState(false);
  const id = useId();
  const wrapper = useRef<HTMLLIElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!open) return;
    const onPointer = (event: PointerEvent) => {
      if (!wrapper.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        wrapper.current?.querySelector<HTMLButtonElement>("button")?.focus();
      }
    };
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const show = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpen(true);
  };
  const hideSoon = () => {
    closeTimer.current = setTimeout(() => setOpen(false), 140);
  };

  return (
    <li
      ref={wrapper}
      className="relative"
      onPointerEnter={(event) => event.pointerType === "mouse" && show()}
      onPointerLeave={(event) => event.pointerType === "mouse" && hideSoon()}
      onBlur={(event) => {
        if (!wrapper.current?.contains(event.relatedTarget as Node)) setOpen(false);
      }}
    >
      <button
        type="button"
        aria-expanded={open}
        aria-controls={id}
        aria-current={isActive(pathname, href) ? "page" : undefined}
        onClick={() => setOpen((value) => !value)}
        className={linkClass}
      >
        {label}
        <Chevron open={open} />
      </button>

      <div
        id={id}
        className={`absolute top-full left-1/2 w-[30rem] -translate-x-1/2 pt-4 transition-[opacity,translate,visibility] duration-300 ${
          open ? "visible translate-y-0 opacity-100" : "invisible -translate-y-1 opacity-0"
        }`}
      >
        <div className="rounded-[1.75rem] border border-line-strong bg-panel p-2.5 shadow-[0_30px_80px_-25px_rgba(0,0,0,0.8)]">
          <ul>
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setOpen(false)}
                  aria-current={pathname === link.href ? "page" : undefined}
                  className="block rounded-2xl px-4 py-3 text-fg no-underline transition-colors hover:bg-white/[0.05] aria-[current=page]:bg-white/[0.05] aria-[current=page]:text-gold"
                >
                  <span className="block font-semibold">{link.label}</span>
                  {link.description ? <span className="mt-0.5 block text-[0.9375rem] leading-snug text-fg-muted">{link.description}</span> : null}
                </Link>
              </li>
            ))}
          </ul>
          <Link
            href={footer.href}
            onClick={() => setOpen(false)}
            className="mt-1.5 flex items-center justify-between rounded-2xl bg-white/[0.05] px-4 py-3 font-semibold text-gold no-underline transition-colors hover:bg-white/[0.09]"
          >
            {footer.label}
            <svg viewBox="0 0 20 20" aria-hidden="true" className="size-4">
              <path d="M4 10h11M11 5l5 5-5 5" stroke="currentColor" strokeWidth="1.75" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>
      </div>
    </li>
  );
}

/**
 * Floating pill navigation. Services and Insights open panels of links; on phones everything
 * moves into a full-screen menu.
 */
export function SiteHeader({ serviceLinks, insightLinks }: { serviceLinks: NavLink[]; insightLinks: NavLink[] }) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
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

  const mobileLinks: (NavLink & { children?: NavLink[] })[] = [
    { href: "/", label: "Home" },
    { href: "/services", label: "Services", children: serviceLinks },
    { href: "/pricing", label: "Pricing" },
    { href: "/insights", label: "Insights" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-4 md:pt-4">
      <div aria-hidden="true" className="scroll-progress fixed inset-x-0 top-0 h-0.5 origin-left scale-x-0 bg-gold" />
      <div
        className={`relative z-50 mx-auto flex h-16 max-w-[1240px] md:h-[4.5rem] items-center justify-between gap-3 rounded-full border pr-2 pl-4 backdrop-blur-xl transition-[background-color,border-color,box-shadow] duration-500 sm:pl-5 ${
          scrolled || open
            ? "border-line-strong bg-night/85 shadow-[0_18px_50px_-18px_rgba(0,0,0,0.85)]"
            : "border-white/10 bg-night/55 shadow-[0_12px_40px_-20px_rgba(0,0,0,0.6)]"
        }`}
      >
        <Link href="/" className="inline-flex shrink-0 items-center no-underline">
          <BrandLogo priority className="h-11 w-auto md:h-14" />
        </Link>

        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex items-center gap-0.5">
            <li>
              <Link href="/" aria-current={isActive(pathname, "/") ? "page" : undefined} className={linkClass}>
                Home
              </Link>
            </li>
            <NavMenu
              label="Services"
              href="/services"
              links={serviceLinks}
              footer={{ href: "/services", label: "All services" }}
              pathname={pathname}
            />
            <li>
              <Link href="/pricing" aria-current={isActive(pathname, "/pricing") ? "page" : undefined} className={linkClass}>
                Pricing
              </Link>
            </li>
            <NavMenu
              label="Insights"
              href="/insights"
              links={insightLinks}
              footer={{ href: "/insights", label: "All insights and guides" }}
              pathname={pathname}
            />
            <li>
              <Link href="/about" aria-current={isActive(pathname, "/about") ? "page" : undefined} className={linkClass}>
                About
              </Link>
            </li>
            <li>
              <Link href="/contact" aria-current={isActive(pathname, "/contact") ? "page" : undefined} className={linkClass}>
                Contact
              </Link>
            </li>
          </ul>
        </nav>

        <Link href="/book" className="btn btn-gold hidden h-12 min-h-0 shrink-0 px-6 lg:inline-flex">
          Book a consultation
        </Link>

        <button
          type="button"
          className="inline-flex h-12 items-center gap-2.5 rounded-full border border-line-strong px-5 text-[0.975rem] font-semibold text-fg lg:hidden"
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

      <div id="mobile-menu" hidden={!open} className="fixed inset-0 z-40 overflow-y-auto bg-night/97 pt-24 backdrop-blur-xl lg:hidden">
        <nav aria-label="Main" className="page-container flex min-h-full flex-col pb-8">
          <ul>
            {mobileLinks.map((item, index) => (
              <li key={item.href} className="rise border-b border-line" style={{ "--d": `${index * 60}ms` } as CSSProperties}>
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  aria-current={isActive(pathname, item.href) ? "page" : undefined}
                  className="block py-4 font-serif text-[2rem] text-fg no-underline aria-[current=page]:text-gold"
                >
                  {item.label}
                </Link>
                {item.children ? (
                  <ul className="-mt-1 pb-4">
                    {item.children.map((child) => (
                      <li key={child.href}>
                        <Link
                          href={child.href}
                          onClick={() => setOpen(false)}
                          aria-current={pathname === child.href ? "page" : undefined}
                          className="block py-1.5 pl-4 text-lede text-fg-muted no-underline aria-[current=page]:text-gold"
                        >
                          {child.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : null}
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
