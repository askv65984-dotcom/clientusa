import type { Metadata } from "next";
import { LegalPage, type LegalSection } from "@/components/site/legal-page";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Professional Disclaimer",
  description:
    "What Anoka Advisors' operations consulting covers and what it does not: no legal, medical, billing or coding advice, and no guarantee of specific results.",
  path: "/disclaimer",
});

const sections: LegalSection[] = [
  {
    id: "operations-consulting",
    title: "Operations consulting only",
    body: (
      <p>
        Anoka Advisors provides operational consulting: workflow, staffing, scheduling, technology selection, reporting
        and readiness planning for healthcare, telehealth and pharmacy organizations.
      </p>
    ),
  },
  {
    id: "legal",
    title: "Not legal advice",
    body: (
      <p>
        We do not provide legal advice. Questions about licensure, prescribing rules, privacy law, contracts or
        regulatory compliance should be reviewed with a qualified attorney. We are happy to work alongside your counsel.
      </p>
    ),
  },
  {
    id: "medical",
    title: "Not medical advice",
    body: (
      <p>
        We do not provide medical or clinical advice and do not make decisions about patient care. Clinical decisions
        remain with licensed clinicians.
      </p>
    ),
  },
  {
    id: "billing",
    title: "No billing or coding determinations",
    body: (
      <p>
        We may help organize questions about reimbursement and payer policy, but we do not provide coding or billing
        determinations. Confirm these with qualified billing professionals and the relevant payers.
      </p>
    ),
  },
  {
    id: "regulators",
    title: "Inspections and accreditation",
    body: (
      <p>
        Readiness work helps you prepare. Final decisions on inspections, licenses and accreditation rest with the
        relevant board, agency or accrediting body.
      </p>
    ),
  },
  {
    id: "results",
    title: "No guarantee of results",
    body: <p>Outcomes depend on many factors outside our control, including how and whether recommendations are carried out.</p>,
  },
  {
    id: "general-information",
    title: "Website content is general information",
    body: (
      <p>
        Articles and descriptions on this website are general information, not advice for your situation. Do not act on
        them without considering your own circumstances.
      </p>
    ),
  },
  {
    id: "vendors",
    title: "Vendors and third parties",
    body: (
      <p>
        Mentioning a product, platform or organization is not an endorsement. When we help you compare vendors, the
        final choice is yours.
      </p>
    ),
  },
  {
    id: "relationship",
    title: "No client relationship from using the website",
    body: <p>Using this website or sending a message does not create a consulting relationship. That begins only when you buy a package or sign an agreement.</p>,
  },
];

export default function DisclaimerPage() {
  return (
    <LegalPage
      description={String(metadata.description ?? "")}
      image="lg-disclaimer"
      title="Professional disclaimer"
      path="/disclaimer"
      intro={<p>This page explains what our services cover and what they do not.</p>}
      sections={sections}
    />
  );
}
