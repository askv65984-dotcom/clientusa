import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { Carousel } from "@/components/site/carousel";
import { InsightCard } from "@/components/site/insight-card";
import { JsonLd } from "@/components/site/json-ld";
import {
  CheckList,
  CtaBand,
  FaqSection,
  FeatureCards,
  ImageCard,
  Marquee,
  PageHero,
  SectionHeading,
  SplitSection,
  type ImageCardItem,
} from "@/components/site/sections";
import { insights } from "@/content/insights";
import { engagementModels, engagementSteps, generalFaqs, services } from "@/content/services";
import { faqJsonLd, pageMetadata, webPageJsonLd } from "@/lib/seo";
import { absoluteUrl } from "@/lib/site";
import { photoSrc } from "@/lib/photos";

export const metadata: Metadata = pageMetadata({
  title: "Healthcare Consulting Services",
  description:
    "Operations consulting for medical practices, telehealth programs and pharmacies: patient access, workflow, staffing, compliance and launch support.",
  path: "/services",
});

const capabilities = [
  "Process mapping and time studies",
  "Measure design and monthly scorecards",
  "SOP and policy writing",
  "Vendor requirements and selection",
  "Staffing and role design",
  "Change management and staff training",
];

const audiences: ImageCardItem[] = [
  { image: "aud-practices", title: "Medical practices", body: "Independent and multi-site groups." },
  { image: "aud-specialty", title: "Specialty clinics", body: "Therapy, specialty and ambulatory centers." },
  { image: "aud-telehealth", title: "Virtual care teams", body: "Programs inside practices and health systems." },
  { image: "aud-health-systems", title: "Health systems", body: "Service lines and operations leadership." },
  { image: "aud-pharmacies", title: "Community pharmacies", body: "Independent and small-chain pharmacies." },
  { image: "aud-ltc", title: "Long-term care pharmacy", body: "Closed-door and facility-focused operations." },
];

const deliverables = [
  "Current-state workflow maps your team recognizes",
  "Prioritized findings with the expected effect of each change",
  "An implementation roadmap with owners and dates",
  "Measure definitions and a simple monthly scorecard",
  "SOPs, checklists, scripts and training materials",
  "A briefing for your leadership team or board",
];

const faqs = [generalFaqs[0], generalFaqs[1], generalFaqs[2], generalFaqs[4]];

export default function ServicesPage() {
  return (
    <>
      {/* 1 */}
      <PageHero
        image="services-hero"
        breadcrumbs={
          <Breadcrumbs
            items={[
              { name: "Home", path: "/" },
              { name: "Services", path: "/services" },
            ]}
          />
        }
        title="Consulting services"
        lede="Three connected practice areas. Many problems start in one and reach into another, so we look at the whole path a patient or prescription takes."
      >
        <Link href="/book" className="btn btn-gold">
          Book a consultation
        </Link>
        <Link href="/pricing" className="btn btn-ghost">
          See packages and fees
        </Link>
      </PageHero>

      {/* 2 */}
      <SplitSection image="services-intro" kicker="Our approach" title="Consulting that follows the patient's path">
        <p>
          Healthcare delivery, virtual care and pharmacy are usually managed as separate departments. Patients do not
          experience them that way, and the problems we see rarely respect those boundaries.
        </p>
        <p>
          Whichever area you start in, we look upstream and downstream so that a fix in one place does not create a new
          bottleneck somewhere else.
        </p>
      </SplitSection>

      {/* 3 to 5: one section per practice area */}
      {services.map((service, index) => (
        <SplitSection
          key={service.slug}
          image={service.images.row}
          reverse={index % 2 === 0}
          tone={index % 2 === 0 ? "deep" : "night"}
          kicker={`Practice area ${index + 1} of ${services.length}`}
          title={service.heading}
        >
          <p className="text-lede text-fg">{service.summary}</p>
          <CheckList items={service.focusAreas.map((area) => area.title)} columns={2} />
          <Link href={`/services/${service.slug}`} className="btn btn-gold mt-2">
            Explore {service.name.toLowerCase()}
          </Link>
        </SplitSection>
      ))}

      {/* 6 */}
      <Marquee items={services.flatMap((service) => service.focusAreas.map((area) => area.title))} />

      {/* 7 */}
      <SplitSection image="services-capabilities" kicker="Across every engagement" title="Capabilities that cut across all three areas">
        <p>Whatever the practice area, these are the working tools we bring to the table.</p>
        <CheckList items={capabilities} columns={2} />
      </SplitSection>

      {/* 8 */}
      <section className="overflow-hidden bg-deep py-20 md:py-28">
        <div className="page-container">
          <SectionHeading kicker="Who we serve" title="Organizations we work with" />
          <div data-reveal className="mt-12">
            <Carousel label="Organizations we work with">
              {audiences.map((item) => (
                <ImageCard key={item.title} item={item} />
              ))}
            </Carousel>
          </div>
        </div>
      </section>

      {/* 9 */}
      <section className="page-container py-20 md:py-28">
        <SectionHeading
          kicker="Ways to work together"
          title="Choose the engagement that fits"
          intro="Every engagement has a fixed fee and a written list of what is included."
        />
        <div className="mt-12">
          <FeatureCards items={engagementModels} />
        </div>
      </section>

      {/* 10 */}
      <SplitSection image="services-process" reverse tone="deep" kicker="From first call to lasting change" title="How an engagement runs">
        <ol className="space-y-5">
          {engagementSteps.map((step, index) => (
            <li key={step.title} className="flex gap-5">
              <span className="font-serif text-[2.25rem] leading-none text-gold">{index + 1}</span>
              <div>
                <h3 className="font-sans text-lg font-semibold tracking-normal text-fg">{step.title}</h3>
                <p className="mt-1">{step.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </SplitSection>

      {/* 11 */}
      <SplitSection image="services-deliverables" kicker="What you receive" title="Working documents, not shelfware">
        <p>Deliverables depend on the package you choose. These are the documents clients use most.</p>
        <CheckList items={deliverables} />
      </SplitSection>

      {/* 12 */}
      <section aria-labelledby="guides-heading" className="bg-deep py-20 md:py-28">
        <div className="page-container">
          <SectionHeading kicker="Guides" title="Learn before you call" id="guides-heading" intro="Practical articles on the problems each practice area solves." />
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {insights.slice(0, 3).map((insight, index) => (
              <InsightCard key={insight.slug} insight={insight} index={index} />
            ))}
          </div>
          <Link href="/insights" className="btn btn-ghost mt-10">
            All insights
          </Link>
        </div>
      </section>

      {/* 13 */}
      <FaqSection image="faq-default" title="Questions about our services" faqs={faqs} tone="night" />

      {/* 14 */}
      <CtaBand />

      <JsonLd
        data={webPageJsonLd({
          type: "CollectionPage",
          path: "/services",
          name: "Healthcare Consulting Services",
          description: "Operations consulting for medical practices, telehealth programs and pharmacies.",
          image: photoSrc("services-hero"),
        })}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: "Anoka Advisors consulting services",
          itemListElement: services.map((service, index) => ({
            "@type": "ListItem",
            position: index + 1,
            url: absoluteUrl(`/services/${service.slug}`),
            name: service.heading,
          })),
        }}
      />
      <JsonLd data={faqJsonLd(faqs, "/services")} />
    </>
  );
}
