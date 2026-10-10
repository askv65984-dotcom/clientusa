import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage, type LegalSection } from "@/components/site/legal-page";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Terms of Service",
  description:
    "Terms for using the Anoka Advisors website and buying consulting packages online, including fees, retainer billing, scheduling and confidentiality.",
  path: "/terms",
});

const sections: LegalSection[] = [
  {
    id: "agreement",
    title: "Agreement to these terms",
    body: (
      <p>
        These terms apply to your use of anokaadvisors.com and to consulting packages purchased through it. By using
        the site or buying a package, you agree to them on behalf of yourself and, where applicable, the organization you
        represent.
      </p>
    ),
  },
  {
    id: "services",
    title: "Our services",
    body: (
      <p>
        Anoka Advisors provides operations consulting for healthcare, telehealth and pharmacy organizations. Each
        package description sets out what is included. Larger engagements may be covered by a separate written
        agreement, which takes precedence over these terms where the two differ.
      </p>
    ),
  },
  {
    id: "no-professional-advice",
    title: "Not legal, medical or financial advice",
    body: (
      <p>
        Our work is operational guidance. We do not provide legal, medical, billing, coding, tax or accounting advice,
        and our recommendations do not replace advice from your attorney, compliance officer or other licensed
        professionals. See our <Link href="/disclaimer">professional disclaimer</Link>.
      </p>
    ),
  },
  {
    id: "fees",
    title: "Fees and payment",
    body: (
      <ul>
        <li>Prices are listed in US dollars and charged through Stripe at checkout.</li>
        <li>One-time packages are charged once when you complete checkout.</li>
        <li>Paid sessions, such as the Operations Diagnostic, are paid when you book. You choose your time after payment.</li>
        <li>Applicable taxes, if any, are shown at checkout.</li>
        <li>Promotion codes apply only where stated and cannot be exchanged for cash.</li>
      </ul>
    ),
  },
  {
    id: "retainer",
    title: "Monthly retainer billing and cancellation",
    body: (
      <p>
        The monthly retainer is billed on the same date each month until it is canceled. You can cancel at any time by
        contacting us; cancellation takes effect at the end of the current billing period, and support continues until
        then.
      </p>
    ),
  },
  {
    id: "scheduling",
    title: "Scheduling and rescheduling",
    body: (
      <p>
        Sessions are booked through our online scheduling page. If you need to reschedule, use the link in your
        confirmation email or contact us as early as you can. Questions about a charge are handled directly with you;
        contact us and we will work to resolve them.
      </p>
    ),
  },
  {
    id: "client-responsibilities",
    title: "Your responsibilities",
    body: (
      <ul>
        <li>Share information that is accurate and that you are entitled to share</li>
        <li>Do not send patient information unless we have agreed on safeguards first</li>
        <li>Make your own decisions about whether and how to act on our recommendations</li>
        <li>Remain responsible for compliance with the laws and regulations that apply to your organization</li>
      </ul>
    ),
  },
  {
    id: "confidentiality",
    title: "Confidentiality",
    body: (
      <p>
        We treat non-public information you share about your organization as confidential and use it only to deliver
        our services, except where disclosure is required by law.
      </p>
    ),
  },
  {
    id: "intellectual-property",
    title: "Intellectual property",
    body: (
      <p>
        Content on this website belongs to Anoka Advisors or is used under license, including photographs from Pexels.
        Deliverables prepared for you may be used freely within your organization. Our general methods, templates and
        know-how remain ours.
      </p>
    ),
  },
  {
    id: "website-use",
    title: "Using this website",
    body: (
      <p>
        Do not misuse the site, including by attempting to gain unauthorized access, interfering with its operation,
        submitting false information or sending unsolicited marketing through our forms.
      </p>
    ),
  },
  {
    id: "third-parties",
    title: "Third-party services",
    body: (
      <p>
        Payments, scheduling and some other features are provided by third parties such as Stripe and our scheduling
        provider. Their own terms and privacy policies apply to your use of those services.
      </p>
    ),
  },
  {
    id: "disclaimers",
    title: "Disclaimers",
    body: (
      <p>
        The website and its content are provided &ldquo;as is&rdquo;. While we work to keep information accurate, we do
        not guarantee that the site will be error-free or always available, or that any particular result will follow
        from our recommendations.
      </p>
    ),
  },
  {
    id: "liability",
    title: "Limitation of liability",
    body: (
      <p>
        To the extent permitted by law, Anoka Advisors is not liable for indirect, incidental, special or consequential
        damages, and our total liability for any claim relating to a package is limited to the amount you paid for that
        package.
      </p>
    ),
  },
  {
    id: "governing-law",
    title: "Governing law",
    body: (
      <p>
        These terms are governed by the laws of the state in which Anoka Advisors is organized, without regard to its
        conflict of law rules.
      </p>
    ),
  },
  {
    id: "changes",
    title: "Changes to these terms",
    body: <p>We may update these terms. The date at the top shows when they last changed. Purchases are governed by the terms in effect when you bought.</p>,
  },
];

export default function TermsPage() {
  return (
    <LegalPage
      description={String(metadata.description ?? "")}
      image="lg-terms"
      title="Terms of service"
      path="/terms"
      intro={<p>Please read these terms before using the website or buying a consulting package.</p>}
      sections={sections}
    />
  );
}
