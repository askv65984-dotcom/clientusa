import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/site/sections";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Checkout Unavailable",
  description: "Checkout could not be started.",
  path: "/checkout/unavailable",
  noIndex: true,
});

export default function CheckoutUnavailablePage() {
  return (
    <PageHero
      image="ck-cancel"
      title="Checkout could not be started"
      lede="The package may have changed since the page loaded, or our payment system did not respond. You have not been charged. Open the packages again, or contact us and we will help you finish."
    >
      <Link href="/pricing#packages" className="btn btn-accent">
        See current packages
      </Link>
      <Link href="/contact" className="btn btn-ghost">
        Contact us
      </Link>
    </PageHero>
  );
}
