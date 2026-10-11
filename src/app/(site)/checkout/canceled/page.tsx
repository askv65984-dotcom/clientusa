import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/site/sections";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Checkout Canceled",
  description: "Your checkout was canceled and you have not been charged.",
  path: "/checkout/canceled",
  noIndex: true,
});

export default function CheckoutCanceledPage() {
  return (
    <PageHero
      image="ck-cancel"
      title="Checkout canceled"
      lede="You have not been charged. If you have questions about a package before buying, send us a message and we will get back to you."
    >
      <Link href="/pricing#packages" className="btn btn-accent">
        Back to packages
      </Link>
      <Link href="/book" className="btn btn-ghost">
        Book a consultation
      </Link>
    </PageHero>
  );
}
