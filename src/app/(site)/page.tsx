import type { Metadata } from "next";
import { getImageProps } from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import { CarePathway } from "@/components/site/care-pathway";
import { Carousel } from "@/components/site/carousel";
import { CountUp } from "@/components/site/count-up";
import { FeeSchedule } from "@/components/site/fee-schedule";
import { HeroVideo } from "@/components/site/hero-video";
import { InsightCard } from "@/components/site/insight-card";
import { JsonLd } from "@/components/site/json-ld";
import { Photo, type PhotoKey } from "@/components/site/photo";
import {
  ArrowIcon,
  CheckList,
  ConversationSection,
  CtaBand,
  FaqSection,
  ImageCard,
  Marquee,
  RevealWords,
  SectionHeading,
  SplitSection,
  Steps,
  practiceTone,
  revealEnd,
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

type Tile = { image: PhotoKey; title: string; tagline: string; href: string; practice?: boolean };

// "What we do": the three practice areas large, then the ways to work with us.
const practiceTiles: Tile[] = [
  { image: "svc-row-healthcare", title: "Healthcare operations", tagline: "Access, workflow, staffing and reporting.", href: "/services/healthcare-operations-consulting", practice: true },
  { image: "th-overview", title: "Telehealth", tagline: "Virtual care that runs like an in-person visit.", href: "/services/telehealth-consulting", practice: true },
  { image: "svc-row-pharmacy", title: "Pharmacy operations", tagline: "Steadier days behind the counter.", href: "/services/pharmacy-operations-consulting", practice: true },
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
    <Link href={tile.href} className="theme-dark soft-shadow group relative isolate block aspect-[4/7] overflow-hidden rounded-[2.75rem] no-underline">
      <Photo name={tile.image} alt="" sizes="80vw" className="-z-10 object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105" />
      <div className="absolute inset-0 -z-10 bg-linear-to-t from-base via-base/40 to-transparent" />
      <span
        aria-hidden="true"
        className="absolute top-6 right-6 grid size-12 place-items-center rounded-full bg-base/80 text-accent transition-colors group-hover:bg-accent group-hover:text-on-accent"
      >
        <ArrowIcon className="size-5" />
      </span>
      <div className="absolute inset-x-0 bottom-0 px-7 pb-9">
        {tile.practice ? <span aria-hidden="true" className={`mb-3 block size-3 rounded-full bg-[var(--tone)] ${practiceTone(tile.title)}`} /> : null}
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
      className={`theme-dark soft-shadow group relative isolate block overflow-hidden rounded-[1.75rem] no-underline transition-transform duration-300 hover:-translate-y-1 ${ratio}`}
    >
      <Photo
        name={tile.image}
        alt=""
        sizes={size === "small" ? "(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 92vw" : "(min-width: 1024px) 45vw, 92vw"}
        className="-z-10 object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105"
      />
      <div className="absolute inset-0 -z-10 bg-linear-to-t from-base via-base/30 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-5 md:p-6">
        <h3 className={`flex items-center gap-2.5 font-sans font-bold tracking-[-0.01em] text-fg ${size === "small" ? "text-[1.25rem]" : "text-[1.5rem] md:text-[1.75rem]"}`}>
          {tile.practice ? <span aria-hidden="true" className={`size-3 shrink-0 rounded-full bg-[var(--tone)] ${practiceTone(tile.title)}`} /> : null}
          {tile.title}
          <ArrowIcon className="size-4 -translate-x-1 text-accent opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100" />
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

const heroTitle = "Healthcare operations that work for your staff and your patients.";

// The first frame of each hero video, shown at once and kept as the still for reduced motion.
const {
  props: { srcSet: posterWide },
} = getImageProps({ src: "/videos/hero-wide.webp", alt: "", width: 1920, height: 1080, sizes: "100vw", fetchPriority: "high" });
const { props: poster } = getImageProps({ src: "/videos/hero-square.webp", alt: "", width: 900, height: 900, sizes: "100vw", fetchPriority: "high" });

const iconProps = { viewBox: "0 0 20 20", className: "size-5", fill: "none", stroke: "currentColor", strokeWidth: 1.6, strokeLinecap: "round", strokeLinejoin: "round" } as const;

const welcomeNotes = [
  {
    title: "Video consultations, booked online",
    body: "Pick a time that suits you and join from your browser.",
    icon: (
      <svg {...iconProps}>
        <rect x="2.5" y="5" width="11" height="10" rx="2" />
        <path d="M13.5 9l4-2.5v7l-4-2.5" />
      </svg>
    ),
  },
  {
    title: "Fixed, published fees",
    body: "Every package lists what it includes and what it costs.",
    icon: (
      <svg {...iconProps}>
        <path d="M3 10.5V4a1 1 0 011-1h6.5L17 9.5 10.5 16z" />
        <circle cx="7" cy="7" r="1.25" />
      </svg>
    ),
  },
  {
    title: "Remote or on site",
    body: "We work with teams in every US state.",
    icon: (
      <svg {...iconProps}>
        <path d="M10 17.5s5.5-5 5.5-9.25a5.5 5.5 0 10-11 0C4.5 12.5 10 17.5 10 17.5z" />
        <circle cx="10" cy="8.25" r="2" />
      </svg>
    ),
  },
];

export default async function HomePage() {
  const [packages, consultation] = await Promise.all([getActivePackages(), getConsultationPackage()]);
  // The paid session length comes from admin, for example "90-minute session and written summary".
  const minutes = Number(consultation?.duration_label.match(/(\d+)[-\s]*min/i)?.[1] ?? 0);
  const figures = [
    stats[0],
    minutes > 0
      ? { value: minutes, suffix: " min", label: `${consultation?.name} by video, booked and paid online` }
      : { value: 2, suffix: " ways", label: "To start: an initial consultation or a paid diagnostic" },
    ...stats.slice(1),
  ];

  return (
    <>
      {/* 1. Hero: a looping 3D animation, with the words beside it */}
      <section aria-labelledby="hero-heading" className="theme-dark relative isolate overflow-hidden bg-base pt-[56svh] pb-28 lg:flex lg:min-h-[100svh] lg:items-center lg:pt-32 lg:pb-36">
        <picture>
          <source media="(min-width: 1024px)" srcSet={posterWide} />
          {/* Art-directed poster from getImageProps: the wide frame on desktops, the square one on phones. */}
          <img {...poster} alt="" className="hero-media-box absolute inset-x-0 top-0 -z-10 w-full object-cover" />
        </picture>
        <HeroVideo />
        <div
          aria-hidden="true"
          className="hero-media-shade absolute inset-x-0 top-0 -z-10 bg-linear-to-t from-base from-10% via-transparent via-50% to-transparent lg:bg-linear-to-l lg:from-base/95 lg:from-0% lg:via-base/45 lg:via-50%"
        />
        <div className="page-container grid w-full lg:grid-cols-12">
          <div className="lg:col-span-6 lg:col-start-7">
            <h1 id="hero-heading" className="max-w-[18ch] text-[clamp(2.6rem,1.4rem+3.1vw,4.25rem)] leading-[1.06] font-semibold text-fg">
              <RevealWords text={heroTitle} start={200} />
            </h1>
            <p className="rise mt-7 max-w-[36rem] text-lede text-fg/85" style={delay(revealEnd(heroTitle, 200) + 80)}>
              Anoka Advisors is an operations consulting partner for medical practices, telehealth programs and
              pharmacies. We help you untangle the workflows behind patient access, prescriptions and compliance, so
              the days run calmer for your team and care feels clearer for patients.
            </p>
            <div className="rise mt-9 flex flex-wrap gap-3" style={delay(revealEnd(heroTitle, 200) + 220)}>
              <Link href="/book" className="btn btn-accent">
                Book a consultation
              </Link>
              <Link href="/pricing" className="btn btn-ghost">
                See packages and fees
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* A card of reassurances that rises over the bottom of the hero */}
      <div className="page-container relative z-10 -mt-16 mb-14 md:-mt-20 md:mb-20">
        <ul className="rise soft-shadow grid gap-6 rounded-[1.75rem] bg-panel px-6 py-7 sm:grid-cols-3 md:rounded-[2.25rem] md:px-10 md:py-9" style={delay(500)}>
          {welcomeNotes.map((note) => (
            <li key={note.title} className="flex gap-4">
              <span aria-hidden="true" className="mt-1 grid size-10 shrink-0 place-items-center rounded-full bg-accent/12 text-accent">
                {note.icon}
              </span>
              <div>
                <p className="font-bold text-fg">{note.title}</p>
                <p className="mt-1 text-[1rem] leading-relaxed text-fg-muted">{note.body}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* 2. Focus strip */}
      <Marquee items={["Patient access", "Clinical workflow", "Telehealth launch", "Platform selection", "Dispensing workflow", "Inventory", "Inspection readiness", "Staffing models", "Performance reporting"]} />

      {/* 3. Introduction */}
      <SplitSection image="home-intro" title="Hello, we’re Anoka Advisors.">
        <p className="text-lede text-fg">
          We’re an independent consulting firm focused on the operational side of care:{" "}
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
      <section className="bg-deep py-20 md:py-28">
        <div className="page-container">
          <SectionHeading title="Every patient takes one path. We help with all of it." />
          <div data-reveal className="mt-10">
            <CarePathway />
          </div>
        </div>
      </section>

      {/* 5. What we do */}
      <section aria-labelledby="what-we-do" className="page-container py-20 md:py-28">
        <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
          <div className="max-w-2xl">
            <h2 id="what-we-do" className="text-section text-fg">
              How we can help
            </h2>
            <p className="mt-4 text-lede text-fg-muted">
              Three practice areas, one view of the patient&rsquo;s path, and simple ways to start working together.
            </p>
          </div>
          <Link href="/services" className="group inline-flex items-center gap-2 font-bold text-accent no-underline hover:text-accent-strong">
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
          <SectionHeading title="The people we work alongside" />
          <div data-reveal className="mt-12">
            <Carousel label="Organizations we work with">
              {audiences.map((item) => (
                <ImageCard key={item.title} item={item} ratio="aspect-[5/4]" />
              ))}
            </Carousel>
          </div>
        </div>
      </section>

      {/* 7. Problems we solve, as they are told to us */}
      <ConversationSection
        id="problems-heading"
        title="Does any of this sound like your week?"
        intro="This is what we hear on first calls, in one form or another."
        image="home-problems"
        lines={problems}
        reply="You’re not alone. An outside view usually pays for itself quickly."
      >
        <p data-reveal className="mt-10 text-fg-muted">
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
      </ConversationSection>

      {/* 8. Engagement steps, and the numbers behind them */}
      <section className="py-20 md:py-28">
        <div className="page-container">
          <SectionHeading title="Working together, one step at a time" intro="A simple path from the first conversation to lasting change." />
          <div className="mt-14">
            <Steps steps={engagementSteps} />
          </div>
          <dl className="mt-20 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {figures.map((stat, index) => (
              <div key={stat.label} data-reveal style={delay(index * 110)} className="shape-bubble bg-panel px-6 py-6">
                <dt className="sr-only">{stat.label}</dt>
                <dd className="font-serif text-[2.75rem] leading-none font-semibold text-accent">
                  <CountUp value={stat.value} suffix={stat.suffix} />
                </dd>
                <dd className="mt-3 text-[0.975rem] text-fg-muted">{stat.label}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* 9. Focus areas carousel */}
      <section className="overflow-hidden bg-deep py-20 md:py-28">
        <div className="page-container">
          <SectionHeading title="Where we roll up our sleeves" />
          <div data-reveal className="mt-12">
            <Carousel label="Focus areas" slideClassName="basis-[80%] sm:basis-1/2 lg:basis-1/4">
              {focusAreas.map((item) => (
                <ImageCard key={item.title} item={item} ratio="aspect-[4/3]" sizes="(min-width: 1024px) 24vw, (min-width: 640px) 45vw, 80vw" />
              ))}
            </Carousel>
          </div>
        </div>
      </section>

      {/* 10. Packages */}
      <section id="packages" className="scroll-mt-24 py-20 md:py-28">
        <div className="page-container">
          <SectionHeading
            center
            title="Simple packages, with the prices up front"
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

      {/* 11. Why us */}
      <SplitSection image="home-why" reverse tone="deep" title="A senior partner, not a slide deck">
        <dl className="grid gap-x-8 gap-y-7 sm:grid-cols-2">
          {principles.map((principle) => (
            <div key={principle.title}>
              <dt className="font-serif text-[1.375rem] font-medium text-fg">{principle.title}</dt>
              <dd className="mt-1.5">{principle.body}</dd>
            </div>
          ))}
        </dl>
      </SplitSection>

      {/* 12. Insights */}
      <section aria-labelledby="insights-heading" className="py-20 md:py-28">
        <div className="page-container">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <SectionHeading
              title="Reading for busy operations leaders"
              intro="Plain-spoken advice on patient access, virtual care and pharmacy operations."
              id="insights-heading"
            />
            <Link href="/insights" className="btn btn-ghost shrink-0 self-start md:self-auto">
              All insights
            </Link>
          </div>
          <div className="mt-12 grid gap-x-6 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
            {insights.slice(0, 3).map((insight, index) => (
              <InsightCard key={insight.slug} insight={insight} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* 13. FAQ */}
      <FaqSection image="home-faq" title="Questions people often ask us" faqs={generalFaqs} />

      {/* 14. Call to action */}
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
