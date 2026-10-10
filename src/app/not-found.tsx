import type { Metadata } from "next";
import Link from "next/link";
import { RevealObserver } from "@/components/site/reveal-observer";
import { PageHero } from "@/components/site/sections";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";
import { insightLinks, serviceLinks } from "@/lib/nav";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <div id="top" className="site">
      <SiteHeader serviceLinks={serviceLinks} insightLinks={insightLinks} />
      <main id="main">
        <PageHero
          image="not-found"
          title="This page could not be found"
          lede="The link may be out of date, or the page may have moved. These are good places to continue."
        >
          <Link href="/" className="btn btn-gold">
            Go to the home page
          </Link>
          <Link href="/services" className="btn btn-ghost">
            See our services
          </Link>
        </PageHero>
      </main>
      <SiteFooter />
      <RevealObserver />
    </div>
  );
}
