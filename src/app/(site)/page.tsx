import type { Metadata } from "next";
import Link from "next/link";
import type { CSSProperties } from "react";
import { CarePathway } from "@/components/site/care-pathway";
import { Carousel } from "@/components/site/carousel";
import { CountUp } from "@/components/site/count-up";
import { FeeSchedule } from "@/components/site/fee-schedule";
import { HeroSlider, type HeroSlide } from "@/components/site/hero-slider";
import { InsightCard } from "@/components/site/insight-card";
import { JsonLd } from "@/components/site/json-ld";
import { Photo } from "@/components/site/photo";
import {
  CheckList,
  CtaBand,
  FaqSection,
  ImageCard,
  ImageCardGrid,
  Marquee,
  PhotoBand,
  SectionHeading,
  SplitSection,
  Steps,
  type ImageCardItem,
} from "@/components/site/sections";
import { insights } from "@/content/insights";
import { engagementSteps, generalFaqs, services } from "@/content/services";
import { getActivePackages, getConsultationPackage } from "@/lib/data";
import { faqJsonLd, pageMetadata, webPageJsonLd } from "@/lib/seo";
import { photoSrc } from "@/lib/photos";

export const metadata: Metadata = pageMetadata({
  title: "Healthcare, Telehealth & Pharmacy Consulting | Anoka Advisors",
  absoluteTitle: true,
  description:
    "Anoka Advisors helps US medical practices, telehealth programs and pharmacies fix patient access, workflow and compliance. Book a video consultation online.",
  path: "/",
});

const slides: HeroSlide[] = [
  {
    label: "Healthcare operations",
    title: "Fewer bottlenecks between the first phone call and the exam room.",
    body: "Patient access, scheduling, clinical workflow and staffing for practices and clinics.",
    href: "/services/healthcare-operations-consulting",
  },
  {
    label: "Telehealth",
    title: "Virtual care that runs as smoothly as an in-person visit.",
    body: "Program design, platform selection, virtual visit workflows and launch support.",
    href: "/services/telehealth-consulting",
  },
  {
    label: "Pharmacy operations",
    title: "Steadier days behind the pharmacy counter.",
    body: "Dispensing workflow, inventory, staffing and inspection readiness.",
    href: "/services/pharmacy-operations-consulting",
  },
];

const audiences: ImageCardItem[] = [
  { image: "aud-practices", title: "Medical practices", body: "Independent and multi-site practices tightening access, workflow and staffing." },
  { image: "aud-telehealth", title: "Telehealth programs", body: "Practices, health systems and digital health companies growing virtual care." },
  { image: "aud-pharmacies", title: "Community pharmacies", body: "Independent pharmacies balancing service, margins and compliance." },
  { image: "aud-health-systems", title: "Health systems and MSOs", body: "Service line and operations leaders who want an experienced outside view." },
  { image: "aud-specialty", title: "Specialty clinics", body: "Therapy, specialty and ambulatory centers with complex scheduling." },
  { image: "aud-ltc", title: "Long-term care pharmacy", body: "Closed-door and long-term care operations serving facilities and residents." },
];

const focusAreas: ImageCardItem[] = [
  { image: "focus-scheduling", meta: "Healthcare", title: "Patient access and scheduling", body: "Templates, reminders and referral intake that match real capacity." },
  { image: "focus-workflow", meta: "Healthcare", title: "Clinical workflow", body: "Rooming, documentation and handoffs, mapped and simplified." },
  { image: "focus-staffing", meta: "Healthcare", title: "Staffing models", body: "Clear roles and coverage plans based on actual volume." },
  { image: "focus-reporting", meta: "All practice areas", title: "Performance reporting", body: "A short list of measures leadership reviews every month." },
  { image: "focus-platform", meta: "Telehealth", title: "Platform selection", body: "Requirements and a common scorecard to compare vendors." },
  { image: "focus-inventory", meta: "Pharmacy", title: "Inventory and purchasing", body: "Par levels, returns and slow-moving stock reviewed to free up cash." },
  { image: "focus-compliance", meta: "Pharmacy", title: "Inspection readiness", body: "Self-inspection checklists and SOPs that stay current." },
  { image: "focus-accreditation", meta: "Pharmacy", title: "Accreditation preparation", body: "Policies and evidence organized ahead of specialty reviews." },
];

const problems = [
  "Patients wait weeks for appointments while the phones never stop",
  "Telehealth visits that feel improvised to patients and staff",
  "Prescriptions stall between the prescriber and the pharmacy counter",
  "Good people burning out on workarounds",
  "Inspections and audits that trigger a scramble",
  "Reports that nobody trusts or acts on",
];

const stats = [
  { value: 3, suffix: "", label: "Connected practice areas: healthcare, telehealth and pharmacy" },
  { value: 5, suffix: " days", label: "To written findings after an Operations Diagnostic" },
  { value: 50, suffix: " states", label: "Available to organizations in every US state, remotely or on site" },
];

const principles = [
  { title: "Senior attention", body: "The person you talk to on the first call is the person who does the work." },
  { title: "Fixed, published fees", body: "Every package lists what is included and what it costs before you commit." },
  { title: "Built for your team", body: "Recommendations come with owners, a sequence and a realistic sense of effort." },
  { title: "Plain reporting", body: "Short documents, direct answers and no jargon." },
];

const delay = (ms: number) => ({ "--d": `${ms}ms` }) as CSSProperties;

export default async function HomePage() {
  const [packages, consultation] = await Promise.all([getActivePackages(), getConsultationPackage()]);
  // The paid session length comes from admin, for example "90-minute session and written summary".
  const minutes = Number(consultation?.duration_label.match(/(d+)[-s]*min/i)?.[1] ?? 0);
  const figures = [
    stats[0],
    minutes > 0
      ? { value: minutes, suffix: " min", label: `${consultation?.name} by video, booked and paid online` }
      : { value: 2, suffix: " ways", label: "To start: an initial consultation or a paid diagnostic" },
    ...stats.slice(1),
  ];

  return (
    <>
      {/* 1. Hero slider */}
      <HeroSlider
        slides={slides}
        backgrounds={[
          <Photo key="1" name="home-hero-1" alt="" priority sizes="100vw" className="object-cover" />,
          <Photo key="2" name="home-hero-2" alt="" sizes="100vw" className="object-cover" />,
          <Photo key="3" name="home-hero-3" alt="" sizes="100vw" className="object-cover" />,
        ]}
      >
        <p className="kicker rise">Healthcare operations consulting, nationwide</p>
        <h1 className="rise mt-6 max-w-[19ch] text-[clamp(2.6rem,1.5rem+3.4vw,4.6rem)] leading-[1.03] text-fg" style={delay(120)}>
          Operations consulting for healthcare, telehealth and pharmacy.
        </h1>
        <p className="rise mt-7 max-w-[40rem] text-lede text-fg-muted" style={delay(260)}>
          We help practice leaders, virtual care teams and pharmacy owners fix the workflows behind patient access,
          prescriptions and compliance, so the work gets easier for staff and clearer for patients.
        </p>
        <div className="rise mt-9 flex flex-wrap gap-3" style={delay(400)}>
          <Link href="/book" className="btn btn-gold">
            Book a consultation
          </Link>
          <Link href="/pricing" className="btn btn-ghost">
            See packages and fees
          </Link>
        </div>
        <ul className="rise mt-10 flex flex-wrap gap-x-7 gap-y-3 text-[0.9375rem] text-fg-muted" style={delay(540)}>
          {["Video consultations booked online", "Fixed, published fees", "Remote or on site"].map((item) => (
            <li key={item} className="flex items-center gap-2">
              <span aria-hidden="true" className="size-1.5 rotate-45 bg-gold" />
              {item}
            </li>
          ))}
        </ul>
      </HeroSlider>

      {/* 2. Focus strip */}
      <Marquee items={["Patient access", "Clinical workflow", "Telehealth launch", "Platform selection", "Dispensing workflow", "Inventory", "Inspection readiness", "Staffing models", "Performance reporting"]} />

      {/* 3. Introduction */}
      <SplitSection image="home-intro" kicker="Who we are" title="Operations advice from people who know how care actually runs">
        <p>
          Anoka Advisors is an independent consulting firm focused on the operational side of care:{" "}
          <Link href="/services/healthcare-operations-consulting" className="text-link">
            how patients get scheduled and seen
          </Link>
          ,{" "}
          <Link href="/services/pharmacy-operations-consulting" className="text-link">
            how prescriptions move from order to pickup
          </Link>{" "}
          and{" "}
          <Link href="/services/telehealth-consulting" className="text-link">
            how virtual care fits with everything else
          </Link>
          .
        </p>
        <p>
          We work alongside your team rather than handing over a binder. Every engagement ends with changes people can
          carry out on Monday morning.
        </p>
        <CheckList items={["Independent advice focused on your goals", "Practical, written recommendations", "Support through implementation"]} />
        <Link href="/about" className="btn btn-ghost mt-2">
          About the firm
        </Link>
      </SplitSection>

      {/* 4. Patient pathway */}
      <PhotoBand image="home-pathway">
        <div className="page-container py-20 md:py-28">
          <SectionHeading kicker="The whole path" title="Where our three practice areas meet" />
          <div data-reveal className="mt-12 rounded-[24px] border border-line bg-night/60 p-6 backdrop-blur md:p-10">
            <CarePathway />
          </div>
        </div>
      </PhotoBand>

      {/* 5. Practice areas */}
      <section className="page-container py-20 md:py-28">
        <SectionHeading
          kicker="Practice areas"
          title="Three practice areas, one view of the patient's path"
          intro="Many clients come to us with a problem in one area and find it reaches into another. We work across all three."
        />
        <div className="mt-12">
          <ImageCardGrid
            items={services.map((service) => ({
              image: service.images.card,
              title: service.name,
              body: service.summary,
              href: `/services/${service.slug}`,
            }))}
          />
        </div>
      </section>

      {/* 6. Who we work with */}
      <section className="overflow-hidden bg-deep py-20 md:py-28">
        <div className="page-container">
          <SectionHeading kicker="Who we work with" title="Built for the organizations that keep care running" />
          <div data-reveal className="mt-12">
            <Carousel label="Organizations we work with">
              {audiences.map((item) => (
                <ImageCard key={item.title} item={item} ratio="aspect-[4/5]" />
              ))}
            </Carousel>
          </div>
        </div>
      </section>

      {/* 7. Problems we solve */}
      <SplitSection image="home-problems" reverse kicker="Sound familiar?" title="The problems we are called in to fix">
        <p>If any of these describe a normal week, an outside view usually pays for itself quickly.</p>
        <CheckList items={problems} />
        <p>
          Our guides on{" "}
          <Link href="/insights/reduce-patient-no-shows" className="text-link">
            reducing patient no-shows
          </Link>{" "}
          and{" "}
          <Link href="/insights/pharmacy-workflow-optimization" className="text-link">
            cutting pharmacy wait times
          </Link>{" "}
          show where to start.
        </p>
      </SplitSection>

      {/* 8. Engagement steps */}
      <section className="bg-deep py-20 md:py-28">
        <div className="page-container">
          <SectionHeading kicker="How it works" title="How an engagement works" intro="A simple path from the first conversation to lasting change." />
          <div className="mt-12">
            <Steps steps={engagementSteps} />
          </div>
        </div>
      </section>

      {/* 9. Numbers */}
      <PhotoBand image="home-stats">
        <div className="page-container py-20 md:py-24">
          <dl className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {figures.map((stat, index) => (
              <div key={stat.label} data-reveal style={delay(index * 110)} className="border-l border-gold/50 pl-6">
                <dt className="sr-only">{stat.label}</dt>
                <dd className="font-serif text-[3.5rem] leading-none text-gold">
                  <CountUp value={stat.value} suffix={stat.suffix} />
                </dd>
                <dd className="mt-3 text-fg-muted">{stat.label}</dd>
              </div>
            ))}
          </dl>
        </div>
      </PhotoBand>

      {/* 10. Focus areas carousel */}
      <section className="overflow-hidden py-20 md:py-28">
        <div className="page-container">
          <SectionHeading kicker="Where we help" title="Focus areas across our practice" />
          <div data-reveal className="mt-12">
            <Carousel label="Focus areas" slideClassName="basis-[80%] sm:basis-1/2 lg:basis-1/4">
              {focusAreas.map((item) => (
                <ImageCard key={item.title} item={item} ratio="aspect-[3/4]" sizes="(min-width: 1024px) 24vw, (min-width: 640px) 45vw, 80vw" />
              ))}
            </Carousel>
          </div>
        </div>
      </section>

      {/* 11. Packages */}
      <section id="packages" className="relative isolate scroll-mt-24 overflow-hidden bg-deep py-20 md:py-28">
        <div aria-hidden="true" className="glow left-1/2 top-10 -z-10 size-[30rem] -translate-x-1/2 bg-gold/15" />
        <div className="page-container">
          <SectionHeading
            center
            kicker="Packages and fees"
            title="Clear packages, published prices"
            intro={
              <>
                Not sure which fits?{" "}
                <Link href="/book#initial" className="text-link">
                  Request an initial consultation
                </Link>{" "}
                and we will recommend one.
              </>
            }
          />
          <div className="mt-14">
            <FeeSchedule packages={packages} />
          </div>
        </div>
      </section>

      {/* 12. Why us */}
      <SplitSection image="home-why" kicker="Why Anoka Advisors" title="A senior partner, not a slide deck">
        <dl className="grid gap-6 sm:grid-cols-2">
          {principles.map((principle) => (
            <div key={principle.title} className="border-t border-line-strong pt-4">
              <dt className="font-serif text-[1.375rem] text-fg">{principle.title}</dt>
              <dd className="mt-1.5 text-[0.975rem]">{principle.body}</dd>
            </div>
          ))}
        </dl>
      </SplitSection>

      {/* 13. Insights */}
      <section aria-labelledby="insights-heading" className="bg-deep py-20 md:py-28">
        <div className="page-container">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <SectionHeading
              kicker="Insights"
              title="Practical guides from our work"
              intro="Plain-spoken advice on patient access, virtual care and pharmacy operations."
              id="insights-heading"
            />
            <Link href="/insights" className="btn btn-ghost shrink-0">
              All insights
            </Link>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {insights.slice(0, 3).map((insight, index) => (
              <InsightCard key={insight.slug} insight={insight} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* 14. FAQ */}
      <FaqSection image="home-faq" title="Common questions" faqs={generalFaqs} tone="night" />

      {/* 15. Call to action */}
      <CtaBand />

      <JsonLd
        data={webPageJsonLd({
          path: "/",
          name: "Healthcare, Telehealth & Pharmacy Consulting",
          description: "Anoka Advisors helps US medical practices, telehealth programs and pharmacies fix patient access, workflow and compliance.",
          image: photoSrc("home-hero-1"),
          breadcrumb: false,
        })}
      />
      <JsonLd data={faqJsonLd(generalFaqs, "/")} />
    </>
  );
}
