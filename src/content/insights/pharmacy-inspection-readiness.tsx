import Link from "next/link";
import { ArticleFigure, Callout } from "@/components/site/article-figure";
import type { Insight } from "./types";

function Body() {
  return (
    <>
      <p>
        Board of pharmacy inspections are often unannounced. Pharmacies that treat readiness as a year-round habit get
        through them calmly; those that prepare only when an inspector walks in tend to scramble for documents that
        should have been at hand. This checklist covers the areas most inspections touch. Requirements vary by state, so
        use it alongside your own board&rsquo;s rules and self-inspection form.
      </p>

      <h2 id="why-year-round">Why year-round readiness beats the scramble</h2>
      <p>
        Inspection findings rarely come from one dramatic failure. They come from small things that slipped: an expired
        license on the wall, a missing temperature log, an SOP nobody has reviewed in years. A short, regular routine
        catches those before an inspector does, and it also makes the pharmacy safer day to day.
      </p>

      <h2 id="licenses">Licenses, registrations and postings</h2>
      <ul>
        <li>Pharmacy permit current and displayed as your state requires</li>
        <li>Pharmacist and technician licenses or registrations current, with renewal dates tracked</li>
        <li>DEA registration current, if you handle controlled substances</li>
        <li>Any required notices to patients posted where your state requires them</li>
      </ul>

      <h2 id="sops">Policies and procedures</h2>
      <p>
        Keep a current SOP library covering dispensing, verification, counseling, controlled substances, storage,
        recalls, errors and, if applicable, compounding. Review each SOP at least once a year, record the review date, and
        have staff confirm they have read the procedures that apply to them.
      </p>

      <h2 id="controlled-substances">Controlled substances</h2>
      <ul>
        <li>A complete inventory of controlled substances at least every two years, as federal rules require</li>
        <li>Records of receipts and dispensing that reconcile with inventory</li>
        <li>Schedule II ordering records, whether on paper forms or electronic ordering</li>
        <li>Secure storage and controlled access</li>
        <li>A clear process for reporting theft or significant loss as required</li>
      </ul>
      <p>Many pharmacies reconcile high-risk products far more often than the minimum, which catches problems early.</p>

      <ArticleFigure image="in-inspection-2" caption="A short monthly checklist keeps logs, licenses and records current between inspections." />

      <h2 id="storage">Storage, temperature and expired stock</h2>
      <ul>
        <li>Refrigerator and freezer temperature logs complete, with action taken on any excursion</li>
        <li>Expired, damaged and recalled products separated and clearly labeled</li>
        <li>Clean, organized storage areas with appropriate security</li>
      </ul>

      <h2 id="compounding">Compounding, if you compound</h2>
      <p>
        Inspections of compounding pharmacies look closely at compliance with the applicable USP chapters, such as{" "}
        <strong>&lt;795&gt;</strong> for non-sterile compounding, <strong>&lt;797&gt;</strong> for sterile compounding
        and <strong>&lt;800&gt;</strong> for hazardous drugs, along with state requirements. Keep training and competency
        records, cleaning logs, environmental monitoring where required, and complete compounding records for every
        preparation.
      </p>

      <h2 id="records">Prescription records and counseling</h2>
      <p>
        Prescription records should be complete, retrievable and kept for the period your state requires. If your state
        requires counseling for certain prescriptions or documentation of an offer to counsel, make sure the workflow
        captures it consistently.
      </p>

      <h2 id="training">Staff training and competency</h2>
      <p>
        Keep training records for each staff member, including onboarding, annual refreshers and any specialized training
        such as compounding or immunizations. Inspectors often ask staff how they would handle specific situations, so
        practical training matters as much as paperwork.
      </p>

      <Callout title="Run a mock inspection">
        Many state boards publish a self-inspection form. Once a quarter, have someone who does not usually own each
        area walk through it as an inspector would, and fix what they find.
      </Callout>

      <h2 id="mistakes">Common mistakes to avoid</h2>
      <ul>
        <li>
          <strong>Relying on one person.</strong> If only the pharmacist-in-charge knows where records are kept,
          readiness disappears on their day off.
        </li>
        <li>
          <strong>SOPs that do not match practice.</strong> Inspectors compare what the procedure says with what staff
          actually do. Update the SOP or the practice so they agree.
        </li>
        <li>
          <strong>Assuming the last inspection predicts the next.</strong> Focus areas change, and so do the rules. Keep
          the whole checklist current, not just last time&rsquo;s findings.
        </li>
        <li>
          <strong>Letting small log gaps slide.</strong> A few missing temperature readings are easy to fix today and
          hard to explain later.
        </li>
        <li>
          <strong>Treating readiness as paperwork only.</strong> Records matter, but so does whether staff can explain
          what they would do in a recall, an error or a temperature excursion.
        </li>
      </ul>

      <h2 id="after">After an inspection</h2>
      <p>
        If an inspection produces findings, respond on time with a corrective action plan that names the fix, the owner
        and the date. Then add the issue to your routine checklist so it stays fixed.
      </p>
      <p>
        Specialty pharmacies preparing for accreditation can build on the same habits; our{" "}
        <Link href="/services/pharmacy-operations-consulting">pharmacy operations consulting</Link> covers inspection
        readiness and accreditation preparation. For the day-to-day side, see our guide to{" "}
        <Link href="/insights/pharmacy-workflow-optimization">pharmacy workflow optimization</Link>, or{" "}
        <Link href="/book">book a video consultation</Link> to talk through your situation. Final decisions always rest with
        your board of pharmacy, and your counsel should advise on legal requirements.
      </p>
    </>
  );
}

export const pharmacyInspectionReadiness: Insight = {
  slug: "pharmacy-inspection-readiness",
  shortTitle: "Pharmacy inspection readiness",
  title: "Pharmacy inspection readiness: a year-round checklist",
  metaTitle: "Pharmacy Inspection Readiness Checklist",
  description:
    "Stay ready for a board of pharmacy inspection all year: licenses, SOPs, controlled substance records, temperature logs, compounding records and staff training.",
  category: "Pharmacy operations",
  serviceSlug: "pharmacy-operations-consulting",
  image: "in-inspection",
  published: "2026-10-10",
  updated: "2026-10-10",
  readMinutes: 7,
  keyTakeaways: [
    "Treat readiness as a routine, not a reaction to an inspector arriving.",
    "Track license and registration renewals in one place.",
    "Review every SOP at least annually and record the review.",
    "Keep controlled substance, temperature and compounding records complete and current.",
    "Run a quarterly mock inspection using your state's self-inspection form.",
  ],
  toc: [
    { id: "why-year-round", title: "Why year-round readiness beats the scramble" },
    { id: "licenses", title: "Licenses, registrations and postings" },
    { id: "sops", title: "Policies and procedures" },
    { id: "controlled-substances", title: "Controlled substances" },
    { id: "storage", title: "Storage, temperature and expired stock" },
    { id: "compounding", title: "Compounding, if you compound" },
    { id: "records", title: "Prescription records and counseling" },
    { id: "training", title: "Staff training and competency" },
    { id: "mistakes", title: "Common mistakes to avoid" },
    { id: "after", title: "After an inspection" },
  ],
  faqs: [
    {
      question: "How often should a pharmacy self-inspect?",
      answer:
        "Some states require a self-inspection on a set schedule. Even where they do not, a quarterly walk-through using your state's self-inspection form keeps small issues from building up.",
    },
    {
      question: "How often must controlled substances be inventoried?",
      answer:
        "Federal rules require a complete inventory of controlled substances at least every two years. Many pharmacies reconcile high-risk products much more often, and some states have additional requirements.",
    },
    {
      question: "What should we do if an inspection finds problems?",
      answer:
        "Respond by the deadline with a corrective action plan that names each fix, an owner and a date, then add the item to your routine checklist so it stays fixed.",
    },
  ],
  tags: ["pharmacy inspection", "board of pharmacy", "compliance", "controlled substances"],
  Body,
};
