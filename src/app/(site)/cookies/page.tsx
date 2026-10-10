import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage, type LegalSection } from "@/components/site/legal-page";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Cookie Policy",
  description:
    "Which cookies the Anoka Advisors website and its embedded scheduling and payment services use, why they are used and how to manage them in your browser.",
  path: "/cookies",
});

const sections: LegalSection[] = [
  {
    id: "what-are-cookies",
    title: "What cookies are",
    body: (
      <p>
        Cookies are small text files a website stores in your browser. They can keep you signed in, remember
        preferences or, on some sites, track activity for analytics and advertising.
      </p>
    ),
  },
  {
    id: "our-cookies",
    title: "Cookies we set",
    body: (
      <>
        <p>We keep cookies to a minimum. This site does not use advertising or analytics cookies.</p>
        <ul>
          <li>
            <strong>Sign-in cookies:</strong> set only when staff sign in to our admin area, to keep the session secure.
            Visitors to the public site do not receive them.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "third-party-cookies",
    title: "Cookies from embedded services",
    body: (
      <ul>
        <li>
          <strong>Scheduling:</strong> the booking calendar on our Book a consultation and confirmation pages is provided
          by our scheduling provider, which may set cookies needed to run the calendar.
        </li>
        <li>
          <strong>Payments:</strong> checkout takes place on Stripe&rsquo;s secure pages, where Stripe sets cookies for
          fraud prevention and to complete your payment.
        </li>
      </ul>
    ),
  },
  {
    id: "local-storage",
    title: "Other storage",
    body: <p>We do not use browser storage to track visitors. Pages may remember interface state only for the length of your visit.</p>,
  },
  {
    id: "managing-cookies",
    title: "Managing cookies",
    body: (
      <p>
        You can block or delete cookies in your browser settings. Blocking cookies from embedded services may stop the
        booking calendar or checkout from working; in that case, email us and we will arrange a call another way.
      </p>
    ),
  },
  {
    id: "privacy-signals",
    title: "Global Privacy Control and Do Not Track",
    body: (
      <p>
        Because we do not sell personal information or use tracking cookies, there is nothing for these signals to turn
        off on our own site. Embedded services follow their own policies.
      </p>
    ),
  },
  {
    id: "more",
    title: "More information",
    body: (
      <p>
        Our <Link href="/privacy">privacy policy</Link> explains how we handle personal information more generally.
      </p>
    ),
  },
];

export default function CookiesPage() {
  return (
    <LegalPage
      description={String(metadata.description ?? "")}
      image="lg-cookies"
      title="Cookie policy"
      path="/cookies"
      intro={<p>This page explains which cookies are used on anokaadvisors.com and why.</p>}
      sections={sections}
    />
  );
}
