import type { PhotoKey } from "@/components/site/photo";
import { SERVICE_SLUGS, type ServiceSlug } from "./slugs";

export type Service = {
  slug: ServiceSlug;
  name: string;
  shortName: string;
  metaTitle: string;
  metaDescription: string;
  heading: string;
  summary: string;
  intro: string;
  whoFor: string[];
  focusAreas: { title: string; body: string }[];
  deliverables: string[];
  faqs: { question: string; answer: string }[];
  challenges: string[];
  approach: { title: string; body: string }[];
  outcomes: string[];
  images: {
    hero: PhotoKey;
    card: PhotoKey;
    row: PhotoKey;
    overview: PhotoKey;
    challenges: PhotoKey;
    approach: PhotoKey;
    deliverables: PhotoKey;
    outcomes: PhotoKey;
    cta: PhotoKey;
    whoFor: PhotoKey[];
    focus: PhotoKey[];
  };
};

export const services: Service[] = [
  {
    slug: "healthcare-operations-consulting",
    challenges: [
      "Phones ring all day, yet new patients still wait weeks for an appointment",
      "Schedules look full while exam rooms sit empty",
      "Check-in errors turn into denied claims weeks later",
      "Staff stay late to finish documentation and handoffs",
      "Nobody agrees on which numbers show how the practice is doing",
    ],
    approach: [
      { title: "Observe", body: "We walk the patient's path with your team and pull the reports behind it." },
      { title: "Diagnose", body: "We find where time, capacity and revenue leak, and why it happens." },
      { title: "Prioritize", body: "We rank fixes by effort and effect, so the first changes pay off quickly." },
      { title: "Implement", body: "We help your team put changes in place and check that they stick." },
    ],
    outcomes: [
      "Shorter waits for new and returning patients",
      "Schedules that match real provider capacity",
      "Cleaner registrations and fewer avoidable denials",
      "Clear roles and fewer late nights for staff",
      "A monthly scorecard leadership actually uses",
    ],
    images: {
      hero: "hc-hero",
      card: "area-healthcare",
      row: "svc-row-healthcare",
      overview: "hc-overview",
      challenges: "hc-challenges",
      approach: "hc-approach",
      deliverables: "hc-deliverables",
      outcomes: "hc-outcomes",
      cta: "hc-engage",
      whoFor: ["hc-aud-1", "hc-aud-2", "hc-aud-3", "hc-aud-4"],
      focus: ["hc-f-access", "hc-f-frontdesk", "hc-f-workflow", "hc-f-staffing", "hc-f-reporting", "hc-f-compliance"],
    },
    name: "Healthcare operations",
    shortName: "Healthcare",
    metaTitle: "Healthcare Operations Consulting",
    metaDescription:
      "Healthcare operations consulting for practices and clinics: patient access, scheduling, clinical workflow, staffing and KPIs. Book a video consultation.",
    heading: "Healthcare operations consulting",
    summary:
      "Patient access, scheduling, front desk and clinical workflow, staffing and the reporting that keeps a practice on track.",
    intro:
      "Operational problems in a practice usually show up as symptoms: long hold times, a full schedule with empty exam rooms, staff who stay late to finish documentation. We trace those symptoms back to the workflows, roles and handoffs behind them, then help your team fix them in an order that makes sense.",
    whoFor: [
      "Independent and multi-site medical practices",
      "Specialty clinics and ambulatory care centers",
      "Management services organizations supporting provider groups",
      "Health system service lines that want an outside view",
    ],
    focusAreas: [
      {
        title: "Patient access and scheduling",
        body: "Schedule templates, referral intake, reminders and no-show follow-up, so the schedule reflects the capacity you really have.",
      },
      {
        title: "Front desk and check-in",
        body: "Registration, eligibility checks and check-in steps that prevent rework later in billing.",
      },
      {
        title: "Clinical workflow and throughput",
        body: "Rooming, visit flow, documentation handoffs and care team roles, mapped and simplified.",
      },
      {
        title: "Staffing and roles",
        body: "Staffing models, clear responsibilities and cross-coverage plans based on your actual volume.",
      },
      {
        title: "Performance reporting",
        body: "A short list of operational measures, where the numbers come from and how to review them each month.",
      },
      {
        title: "Policies and compliance readiness",
        body: "Practical SOPs that support HIPAA and payer requirements, ready for review by your compliance lead or counsel.",
      },
    ],
    deliverables: [
      "Current-state workflow maps",
      "Prioritized findings with the expected effect of each change",
      "Implementation roadmap with owners and dates",
      "Measure definitions and a simple monthly scorecard",
      "Updated SOPs and checklists",
    ],
    faqs: [
      {
        question: "Do you work with small practices?",
        answer:
          "Yes. The Operations Diagnostic is designed for owners and practice managers who want a clear outside view before committing to a larger project.",
      },
      {
        question: "Will you need access to patient information?",
        answer:
          "Usually not. Most of the work uses de-identified reports, schedules and walk-throughs of the process. If an engagement would need protected health information, we agree on the right safeguards and agreements with you before any data is shared.",
      },
      {
        question: "Can you help us put the changes in place?",
        answer:
          "Yes. Every set of recommendations comes with a roadmap, and a focused project or the monthly retainer can cover implementation support, staff training and follow-through.",
      },
    ],
  },
  {
    slug: "telehealth-consulting",
    challenges: [
      "Virtual visits were launched in a hurry and never redesigned",
      "The platform was chosen without a clear list of requirements",
      "No-shows and dropped connections eat into provider time",
      "Licensure and coverage questions slow growth into new states",
      "Billing rules for virtual care are unclear to the front office",
    ],
    approach: [
      { title: "Define", body: "Agree which services go virtual, for which patients, and what success looks like." },
      { title: "Design", body: "Map scheduling, intake, consent, the visit, documentation and follow-up for remote care." },
      { title: "Select", body: "Run structured demos and score platforms against your requirements." },
      { title: "Launch", body: "Pilot, train staff, tell patients what to expect and watch the right measures." },
    ],
    outcomes: [
      "A virtual care model that fits alongside in-person care",
      "A platform chosen on fit, with the reasoning written down",
      "Fewer no-shows and smoother visit starts",
      "A clear plan for growth into new states",
      "Staff who know exactly how a virtual visit runs",
    ],
    images: {
      hero: "th-hero",
      card: "area-telehealth",
      row: "svc-row-telehealth",
      overview: "th-overview",
      challenges: "th-challenges",
      approach: "th-approach",
      deliverables: "th-deliverables",
      outcomes: "th-outcomes",
      cta: "th-engage",
      whoFor: ["th-aud-1", "th-aud-2", "th-aud-3", "th-aud-4"],
      focus: ["th-f-design", "th-f-platform", "th-f-workflow", "th-f-multistate", "th-f-reimbursement", "th-f-launch"],
    },
    name: "Telehealth",
    shortName: "Telehealth",
    metaTitle: "Telehealth Consulting & Program Launch",
    metaDescription:
      "Telehealth consulting for practices, health systems and digital health teams: program design, platform selection, virtual workflows and launch support.",
    heading: "Telehealth consulting",
    summary:
      "Program design, platform selection, virtual visit workflows, multi-state planning and launch support.",
    intro:
      "A telehealth program is an operating model, not a video link. Scheduling, consent, documentation, prescribing, billing and follow-up all work differently when the visit is virtual. We help you design those pieces so the program still works well months after launch.",
    whoFor: [
      "Practices adding virtual visits alongside in-person care",
      "Digital health and virtual care companies",
      "Health systems growing or consolidating telehealth programs",
      "Clinics and pharmacies exploring remote services",
    ],
    focusAreas: [
      {
        title: "Program design",
        body: "Which services to offer virtually, for which patients, and how virtual visits fit with in-person care.",
      },
      {
        title: "Platform and vendor selection",
        body: "Requirements, structured demos and a common scorecard to compare telehealth platforms and EHR integrations.",
      },
      {
        title: "Virtual visit workflows",
        body: "Scheduling, intake, consent, visit flow, documentation and follow-up designed for remote care.",
      },
      {
        title: "Multi-state operations",
        body: "Planning for provider licensure, credentialing and coverage across states, worked through with your legal and credentialing teams.",
      },
      {
        title: "Reimbursement readiness",
        body: "Organizing payer policy, coding and place-of-service questions with your billing team before you launch.",
      },
      {
        title: "Launch and adoption",
        body: "Pilot planning, staff training, patient communication and the measures to watch in the first 90 days.",
      },
    ],
    deliverables: [
      "Telehealth operating model",
      "Platform requirements and vendor scorecard",
      "Virtual visit workflow maps and staff scripts",
      "Launch plan with pilot measures",
      "Staff training materials",
    ],
    faqs: [
      {
        question: "Can you help us choose a telehealth platform?",
        answer:
          "Yes. We help you define requirements, run structured demos and compare vendors against the same scorecard, so the decision rests on fit rather than on the best sales presentation.",
      },
      {
        question: "Do you give legal advice on telehealth rules?",
        answer:
          "No. We organize the operational questions and work alongside your attorney or compliance lead, who advises on licensure, prescribing and privacy requirements.",
      },
      {
        question: "How long does a telehealth launch take?",
        answer:
          "It depends on the services, the platform and the number of states involved. The Operations Diagnostic gives you a realistic timeline for your situation.",
      },
    ],
  },
  {
    slug: "pharmacy-operations-consulting",
    challenges: [
      "Long waits at pickup and a queue of calls on hold",
      "Cash tied up in slow-moving inventory",
      "Pharmacists doing technician work during peak hours",
      "Inspections that set off a scramble for documents",
      "New service ideas without an operating plan behind them",
    ],
    approach: [
      { title: "Walk the workflow", body: "Follow prescriptions from intake to pickup during real business hours." },
      { title: "Read the numbers", body: "Review volume, wait times, inventory turns and staffing patterns." },
      { title: "Redesign", body: "Rebalance steps, roles and schedules to match the volume you actually see." },
      { title: "Sustain", body: "Leave SOPs, checklists and measures that keep the improvements in place." },
    ],
    outcomes: [
      "Shorter waits and fewer calls asking about status",
      "Leaner inventory and healthier cash flow",
      "Pharmacists focused on clinical work",
      "Inspection-ready documentation every day",
      "A practical plan for new services",
    ],
    images: {
      hero: "ph-hero",
      card: "area-pharmacy",
      row: "svc-row-pharmacy",
      overview: "ph-overview",
      challenges: "ph-challenges",
      approach: "ph-approach",
      deliverables: "ph-deliverables",
      outcomes: "ph-outcomes",
      cta: "ph-engage",
      whoFor: ["ph-aud-1", "ph-aud-2", "ph-aud-3", "ph-aud-4"],
      focus: ["ph-f-dispensing", "ph-f-inventory", "ph-f-staffing", "ph-f-inspection", "ph-f-accreditation", "ph-f-services"],
    },
    name: "Pharmacy operations",
    shortName: "Pharmacy",
    metaTitle: "Pharmacy Operations Consulting",
    metaDescription:
      "Pharmacy operations consulting for independent, specialty and long-term care pharmacies: dispensing workflow, inventory, staffing and inspection readiness.",
    heading: "Pharmacy operations consulting",
    summary:
      "Dispensing workflow, inventory and purchasing, staffing, inspection and accreditation readiness, and new services.",
    intro:
      "Pharmacies run on tight margins and tighter timelines. Small inefficiencies in intake, verification, inventory and pickup add up to lost hours and lost revenue. We work with owners and pharmacy managers to steady daily operations and prepare for what comes next.",
    whoFor: [
      "Independent community pharmacies",
      "Specialty and infusion pharmacies",
      "Long-term care and closed-door pharmacies",
      "Telepharmacy and mail-order operations",
    ],
    focusAreas: [
      {
        title: "Dispensing workflow",
        body: "Intake, data entry, verification, fill and pickup redesigned to cut wait times and reduce errors.",
      },
      {
        title: "Inventory and purchasing",
        body: "Ordering habits, par levels, returns and slow-moving stock reviewed to free up cash.",
      },
      {
        title: "Staffing and scheduling",
        body: "Pharmacist and technician roles, schedules matched to volume and cross-training plans.",
      },
      {
        title: "Inspection readiness",
        body: "Self-inspection checklists, SOPs and documentation habits that keep you ready for board of pharmacy visits.",
      },
      {
        title: "Accreditation preparation",
        body: "Policies and evidence organized ahead of specialty pharmacy accreditation reviews such as URAC or ACHC.",
      },
      {
        title: "New services",
        body: "Operational plans for clinical programs, delivery, mail order or telepharmacy.",
      },
    ],
    deliverables: [
      "Workflow and wait-time analysis",
      "Inventory review with cash-flow opportunities",
      "Staffing model matched to volume",
      "SOP library and self-inspection checklist",
      "Service expansion plan",
    ],
    faqs: [
      {
        question: "Do you work with independent pharmacies?",
        answer:
          "Yes. The Operations Diagnostic is priced so an owner can get a clear outside view without committing to a large project.",
      },
      {
        question: "Can you help us prepare for an inspection or accreditation?",
        answer:
          "Yes. We help you organize SOPs, documentation and self-inspections ahead of time. Final decisions rest with the board of pharmacy or the accrediting body.",
      },
      {
        question: "Do you help with telepharmacy?",
        answer:
          "Yes. We assess feasibility, workflow, staffing and technology for telepharmacy models, and work with your counsel on the rules in your state.",
      },
    ],
  },
];

if (services.length !== SERVICE_SLUGS.length || !services.every((service) => SERVICE_SLUGS.includes(service.slug))) {
  throw new Error("SERVICE_SLUGS in src/content/slugs.ts does not match the services list.");
}

export function getService(slug: string) {
  return services.find((service) => service.slug === slug);
}

export const engagementSteps: { image: PhotoKey; title: string; body: string }[] = [
  {
    image: "step-call",
    title: "Initial consultation",
    body: "A video meeting to talk through what is happening and whether we are the right fit. Request a time online and we confirm by email.",
  },
  {
    image: "step-diagnostic",
    title: "Diagnostic",
    body: "A paid working session that pins down the problem, followed by written findings and priorities.",
  },
  {
    image: "step-plan",
    title: "Plan",
    body: "A roadmap with owners, sequence and measures, sized to what your team can take on.",
  },
  {
    image: "step-support",
    title: "Support",
    body: "Hands-on help through a focused project or an ongoing monthly retainer.",
  },
];

export const generalFaqs = [
  {
    question: "How do I get started?",
    answer:
      "Request an initial consultation on our booking page and we confirm a time by email. If you already know the problem, book a paid diagnostic call instead: pay online, then choose your time on our calendar.",
  },
  {
    question: "What is the difference between the initial consultation and the diagnostic?",
    answer:
      "The initial consultation is a first conversation to understand what is happening and whether we can help. The Operations Diagnostic is paid working time: we review your materials, work through one problem in detail and send written recommendations.",
  },
  {
    question: "Where are your clients located?",
    answer:
      "We work with organizations across the United States. Most work happens remotely by video, with on-site visits arranged when a project calls for them.",
  },
  {
    question: "How is payment handled?",
    answer:
      "Payments are processed by Stripe. Card details go directly to Stripe and are never stored on our systems. One-time packages are charged once. The retainer renews monthly until it is canceled.",
  },
  {
    question: "Do we have to start with a retainer?",
    answer:
      "No. Many clients start with the diagnostic or a focused project and move to a retainer only if ongoing support makes sense.",
  },
];

/** The three ways to work together. Links point at the starter package slugs on the pricing page. */
export const engagementModels: { image: PhotoKey; title: string; meta: string; body: string; href: string }[] = [
  {
    image: "model-diagnostic",
    title: "Operations Diagnostic",
    meta: "The best place to start",
    body: "A fixed-fee working session on one problem, followed by written findings and priorities.",
    href: "/pricing#operations-diagnostic",
  },
  {
    image: "model-retainer",
    title: "Monthly advisory retainer",
    meta: "Ongoing support",
    body: "Senior operations advice on call while your team runs the work, billed monthly.",
    href: "/pricing#advisory-retainer",
  },
  {
    image: "model-project",
    title: "Focused project",
    meta: "Typically 4 to 6 weeks",
    body: "A defined scope and deliverable, from telehealth launch plans to pharmacy workflow redesigns.",
    href: "/pricing#operations-project",
  },
];
