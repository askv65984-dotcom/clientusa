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
import { Photo, type PhotoKey } from "@/components/site/photo";
import {
  ArrowIcon,
  CheckList,
  CtaBand,
  FaqSection,
  ImageCard,
  Marquee,
  PhotoBand,
  SectionHeading,
  SplitSection,
  Steps,
  type ImageCardItem,
} from "@/components/site/sections";
import { insights } from "@/content/insights";
import { engagementSteps, generalFaqs } from "@/content/services";
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

type Tile = { image: PhotoKey; title: string; tagline: string; href: string };

// "What we do": the three practice areas large, then the ways to work with us.
const practiceTiles: Tile[] = [
  { image: "svc-row-healthcare", title: "Healthcare operations", tagline: "Access, workflow, staffing and reporting.", href: "/services/healthcare-operations-consulting" },
  { image: "th-overview", title: "Telehealth", tagline: "Virtual care that runs like an in-person visit.", href: "/services/telehealth-consulting" },
  { image: "svc-row-pharmacy", title: "Pharmacy operations", tagline: "Steadier days behind the counter.", href: "/services/pharmacy-operations-consulting" },
];
const offerTiles: Tile[] = [
  { image: "th-approach", title: "Initial consultation", tagline: "Start with a conversation, by video.", href: "/book#initial" },
  { image: "hc-deliverables", title: "Paid diagnostic call", tagline: "An expert read, with written priorities.", href: "/book#options" },
  { image: "hc-engage", title: "Monthly advisory retainer", tagline: "A senior sounding board, every month.", href: "/pricing#advisory-retainer" },
];
const wideTiles: Tile[] = [
  { image: "th-deliverables", title: "Focused projects", tagline: "Launch plans, workflow redesigns and SOP libraries.", href: "/pricing#operations-project" },
  { image: "pr-faq", title: "Insights and guides", tagline: "Practical reading for operations leaders.", href: "/insights" },
];

/** Tall, pill-shaped card for the phone slider, with a round arrow button in the corner. */
function PillTile({ tile }: { tile: Tile }) {
  return (
    <Link href={tile.href} className="group relative isolate block aspect-[4/7] overflow-hidden rounded-[2.75rem] no-underline">
      <Photo name={tile.image} alt="" sizes="80vw" className="-z-10 object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105" />
      <div className="absolute inset-0 -z-10 bg-linear-to-t from-black/90 via-black/35 to-black/10" />
      <span
        aria-hidden="true"
        className="absolute top-6 right-6 grid size-12 place-items-center rounded-full border-2 border-white/80 text-white transition-colors group-hover:border-gold group-hover:bg-gold group-hover:text-night"
      >
        <ArrowIcon className="size-5" />
      </span>
      <div className="absolute inset-x-0 bottom-0 px-7 pb-9">
        <h3 className="font-sans text-[1.75rem] leading-[1.12] font-bold tracking-[-0.015em] text-fg">{tile.title}</h3>
        <p className="mt-3 text-[1.0625rem] leading-snug text-fg/85">{tile.tagline}</p>
      </div>
    </Link>
  );
}

function TileLink({ tile, size, index }: { tile: Tile; size: "large" | "small" | "wide"; index: number }) {
  const ratio = { large: "aspect-[4/3]", small: "aspect-[16/9] lg:aspect-[2/1]", wide: "aspect-[16/9] lg:aspect-[8/3]" }[size];
  return (
    <Link
      href={tile.href}
      data-reveal
      style={delay(index * 80)}
      className={`group relative isolate block overflow-hidden rounded-[22px] border border-line no-underline transition-colors duration-300 hover:border-gold/60 ${ratio}`}
    >
      <Photo
        name={tile.image}
        alt=""
        sizes={size === "small" ? "(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 92vw" : "(min-width: 1024px) 45vw, 92vw"}
        className="-z-10 object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105"
      />
      <div className="absolute inset-0 -z-10 bg-linear-to-t from-black/85 via-black/30 to-black/5" />
      <div className="absolute inset-x-0 bottom-0 p-5 md:p-6">
        <h3 className={`flex items-center gap-2 font-sans font-semibold tracking-[-0.01em] text-fg ${size === "small" ? "text-[1.25rem]" : "text-[1.5rem] md:text-[1.75rem]"}`}>
          {tile.title}
          <ArrowIcon className="size-4 -translate-x-1 text-gold opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100" />
        </h3>
        <p className="mt-1 text-[0.975rem] text-fg/80">{tile.tagline}</p>
      </div>
    </Link>
  );
}

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

      {/* 5. What we do */}
      <section aria-labelledby="what-we-do" className="page-container py-20 md:py-28">
        <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
          <div className="max-w-2xl">
            <h2 id="what-we-do" className="text-section text-fg">
              What we do
            </h2>
            <p className="mt-4 text-lede text-fg-muted">
              Three practice areas, one view of the patient&rsquo;s path, and simple ways to start working together.
            </p>
          </div>
          <Link href="/services" className="group inline-flex items-center gap-2 font-semibold text-gold no-underline hover:text-gold-strong">
            All services
            <ArrowIcon className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Phones: one swipeable row of every tile */}
        <div data-reveal className="mt-10 md:hidden">
          <Carousel label="What we do" slideClassName="basis-[78%]">
            {[...practiceTiles, ...offerTiles, ...wideTiles].map((tile) => (
              <PillTile key={tile.href} tile={tile} />
            ))}
          </Carousel>
        </div>

        {/* Tablets and desktops: the photo grid */}
        <div className="hidden md:block">
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {practiceTiles.map((tile, index) => (
              <TileLink key={tile.href} tile={tile} size="large" index={index} />
            ))}
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {offerTiles.map((tile, index) => (
              <TileLink key={tile.href} tile={tile} size="small" index={index} />
            ))}
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {wideTiles.map((tile, index) => (
              <TileLink key={tile.href} tile={tile} size="wide" index={index} />
            ))}
          </div>
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
