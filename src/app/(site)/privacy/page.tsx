import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage, type LegalSection } from "@/components/site/legal-page";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Privacy Policy",
  description:
    "How Anoka Advisors collects, uses, shares and protects personal information from our website, forms, scheduling and payments, and your privacy rights.",
  path: "/privacy",
});

const sections: LegalSection[] = [
  {
    id: "who-we-are",
    title: "Who we are",
    body: (
      <p>
        Anoka Advisors (&ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;) is an operations consulting firm serving
        healthcare, telehealth and pharmacy organizations in the United States. This policy applies to anokaadvisors.com
        and to information you share with us when you contact us, book a call or buy a package.
      </p>
    ),
  },
  {
    id: "information-we-collect",
    title: "Information we collect",
    body: (
      <ul>
        <li>
          <strong>Contact form:</strong> your name, email address and message, plus your phone number, organization and
          area of interest if you choose to share them.
        </li>
        <li>
          <strong>Newsletter:</strong> your email address and the date you subscribed.
        </li>
        <li>
          <strong>Scheduling:</strong> when you book a call, our scheduling provider collects your name, email, the time
          you choose, your preferred format and any notes or phone number you add.
        </li>
        <li>
          <strong>Purchases:</strong> payments are processed by Stripe. We receive your name, email, phone number,
          billing address, organization name if provided, the package you bought and the payment status. We never see
          or store full card numbers.
        </li>
        <li>
          <strong>Technical data:</strong> our hosting provider records standard server logs such as IP address,
          browser type, pages requested and timestamps, used for security and reliability.
        </li>
      </ul>
    ),
  },
  {
    id: "patient-information",
    title: "Patient and health information",
    body: (
      <p>
        Please do not send protected health information or other patient data through this website, our forms or email.
        If an engagement requires access to patient information, we will agree on appropriate safeguards and any
        required agreements with you before such data is shared.
      </p>
    ),
  },
  {
    id: "how-we-use",
    title: "How we use information",
    body: (
      <ul>
        <li>To respond to inquiries and schedule calls</li>
        <li>To deliver the services you purchase and send related communications</li>
        <li>To send the newsletter you asked for, until you unsubscribe</li>
        <li>To process payments, keep business and tax records and meet legal obligations</li>
        <li>To keep the website secure, prevent misuse and fix problems</li>
      </ul>
    ),
  },
  {
    id: "sharing",
    title: "How we share information",
    body: (
      <>
        <p>
          We do not sell personal information, and we do not share it for cross-context behavioral advertising. We share
          information only with service providers that help us run the business, under their own privacy and security
          commitments:
        </p>
        <ul>
          <li>Stripe, for payment processing and receipts</li>
          <li>Our scheduling provider (such as Calendly or Google Calendar), for booking calls</li>
          <li>Supabase, which hosts the database behind our forms and records</li>
          <li>Our website hosting provider, which serves the site and keeps server logs</li>
          <li>Professional advisers such as accountants and attorneys, where needed</li>
        </ul>
        <p>We may also disclose information when required by law or to protect our rights, our clients or the public.</p>
      </>
    ),
  },
  {
    id: "cookies",
    title: "Cookies",
    body: (
      <p>
        This site does not use advertising or analytics cookies. Embedded services such as our scheduling and payment
        providers may set their own cookies. See our <Link href="/cookies">cookie policy</Link> for details.
      </p>
    ),
  },
  {
    id: "communications",
    title: "Email communications",
    body: (
      <p>
        We send the newsletter only to people who subscribe. Every issue includes a way to unsubscribe, and you can also
        email us to be removed. Service emails about a purchase or a scheduled call are sent regardless of newsletter
        preferences.
      </p>
    ),
  },
  {
    id: "retention",
    title: "How long we keep information",
    body: (
      <p>
        We keep information for as long as needed to respond to you, provide services and meet legal, tax and
        accounting requirements. After that we delete it or keep it in a form that no longer identifies you.
      </p>
    ),
  },
  {
    id: "security",
    title: "Security",
    body: (
      <p>
        We use reputable providers, encrypted connections, access controls and database security rules to protect
        information. No system is perfectly secure, so please share only what is needed.
      </p>
    ),
  },
  {
    id: "your-rights",
    title: "Your privacy rights",
    body: (
      <>
        <p>
          Depending on your state of residence, including California, Colorado, Connecticut, Virginia and other states
          with consumer privacy laws, you may have the right to:
        </p>
        <ul>
          <li>Know what personal information we hold about you and how it is used</li>
          <li>Ask us to correct or delete it</li>
          <li>Receive a copy of it in a portable format</li>
          <li>Opt out of the sale or sharing of personal information (we do neither)</li>
        </ul>
        <p>
          To make a request, email info@anokaadvisors.com. We will verify the request and respond within the time the
          law requires. We will not discriminate against you for exercising these rights.
        </p>
      </>
    ),
  },
  {
    id: "children",
    title: "Children's privacy",
    body: <p>This website is intended for business use and is not directed to children under 13. We do not knowingly collect their information.</p>,
  },
  {
    id: "where-data-is-processed",
    title: "Where information is processed",
    body: (
      <p>
        Our service providers may store and process information in the United States and in other countries where they
        operate. When they do, they apply their own safeguards to protect it.
      </p>
    ),
  },
  {
    id: "changes",
    title: "Changes to this policy",
    body: <p>We may update this policy from time to time. The date at the top shows when it last changed.</p>,
  },
];

export default function PrivacyPage() {
  return (
    <LegalPage
      description={String(metadata.description ?? "")}
      image="lg-privacy"
      title="Privacy policy"
      path="/privacy"
      intro={<p>This policy explains what personal information we collect, how we use it and the choices you have.</p>}
      sections={sections}
    />
  );
}
