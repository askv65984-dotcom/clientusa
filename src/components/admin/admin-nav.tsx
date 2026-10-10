"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { signOut } from "@/app/admin/actions";
import { LogoMark } from "@/components/site/logo";

const links = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/packages", label: "Packages and prices" },
  { href: "/admin/leads", label: "Leads" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/subscribers", label: "Subscribers" },
  { href: "/admin/settings", label: "Settings" },
];

function isActive(pathname: string, href: string) {
  return href === "/admin" ? pathname === "/admin" : pathname === href || pathname.startsWith(`${href}/`);
}

export function AdminNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <aside className="border-b border-sage bg-evergreen text-paper lg:sticky lg:top-0 lg:h-dvh lg:border-b-0">
      <div className="flex items-center justify-between px-5 py-4 lg:px-6 lg:py-7">
        <Link href="/admin" className="inline-flex items-center gap-2.5 text-paper no-underline">
          <LogoMark className="size-7" />
          <span className="font-serif text-lg leading-none">Anoka admin</span>
        </Link>
        <button
          type="button"
          className="min-h-10 rounded-[3px] border border-white/30 px-3 text-sm font-semibold lg:hidden"
          aria-expanded={open}
          aria-controls="admin-menu"
          onClick={() => setOpen((value) => !value)}
        >
          {open ? "Close" : "Menu"}
        </button>
      </div>
      <div id="admin-menu" className={`${open ? "block" : "hidden"} px-3 pb-5 lg:flex lg:h-[calc(100dvh-5.5rem)] lg:flex-col lg:justify-between lg:pb-6`}>
        <nav aria-label="Admin">
          <ul className="space-y-1">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setOpen(false)}
                  aria-current={isActive(pathname, link.href) ? "page" : undefined}
                  className="block rounded-[3px] px-3 py-2.5 text-[0.975rem] text-paper/85 no-underline hover:bg-white/10 hover:text-paper aria-[current=page]:bg-white/15 aria-[current=page]:font-semibold aria-[current=page]:text-paper"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="mt-6 border-t border-white/15 px-3 pt-5 text-sm">
          <div className="flex flex-wrap gap-x-4 gap-y-2">
            <Link href="/" className="text-paper underline decoration-white/40 hover:decoration-white" target="_blank">
              View website
            </Link>
            <form action={signOut}>
              <button type="submit" className="text-paper underline decoration-white/40 hover:decoration-white">
                Sign out
              </button>
            </form>
          </div>
        </div>
      </div>
    </aside>
  );
}
