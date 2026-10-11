import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { InsightCard } from "@/components/site/insight-card";
import { JsonLd } from "@/components/site/json-ld";
import { CtaBand, PageHero, SectionHeading, practiceTone } from "@/components/site/sections";
import { insights, type InsightCategory } from "@/content/insights";
import { services } from "@/content/services";
import { organizationId, pageMetadata, webPageJsonLd } from "@/lib/seo";
import { absoluteUrl } from "@/lib/site";
import { photoSrc } from "@/lib/photos";

const description =
  "Practical guides on healthcare operations, telehealth and pharmacy workflow: patient no-shows, access metrics, platform selection and inspection readiness.";

export const metadata: Metadata = pageMetadata({
  title: "Healthcare Operations Insights and Guides",
  description,
  path: "/insights",
});

const categories: { name: InsightCategory; serviceSlug: string; intro: string }[] = [
  {
    name: "Healthcare operations",
    serviceSlug: "healthcare-operations-consulting",
    intro: "Patient access, scheduling and the measures that keep a practice on track.",
  },
  {
    name: "Telehealth",
    serviceSlug: "telehealth-consulting",
    intro: "Choosing platforms and designing virtual care that works after launch.",
  },
  {
    name: "Pharmacy operations",
    serviceSlug: "pharmacy-operations-consulting",
    intro: "Dispensing workflow, wait times and staying inspection-ready all year.",
  },
];

export default function InsightsPage() {
  const [featured, ...rest] = insights;

  const blogJsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "@id": `${absoluteUrl("/insights")}#blog`,
    name: "Anoka Advisors Insights",
    description,
    url: absoluteUrl("/insights"),
    inLanguage: "en-US",
    publisher: { "@id": organizationId },
    blogPost: insights.map((insight) => ({
      "@type": "BlogPosting",
      headline: insight.title,
      url: absoluteUrl(`/insights/${insight.slug}`),
      datePublished: insight.published,
      dateModified: insight.updated,
      image: absoluteUrl(photoSrc(insight.image)),
      author: { "@id": organizationId },
    })),
  };

  return (
    <>
      <PageHero
        image="insights-hero"
        breadcrumbs={
          <Breadcrumbs
            items={[
              { name: "Home", path: "/" },
              { name: "Insights", path: "/insights" },
            ]}
          />
        }
        title="Insights for people who run healthcare"
        lede="Practical, plain-spoken guides on patient access, virtual care and pharmacy operations, drawn from the problems we help clients solve."
      >
        <a href="#latest" className="btn btn-accent">
          Read the latest
        </a>
        <Link href="/book" className="btn btn-ghost">
          Book a consultation
        </Link>
      </PageHero>

      <section id="latest" aria-labelledby="featured-heading" className="page-container scroll-mt-24 py-20 md:py-24">
        <SectionHeading title="Start here" id="featured-heading" />
        <div className="mt-10 grid gap-x-10 gap-y-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <InsightCard insight={featured} />
          </div>
          <div className="grid content-start gap-10 lg:col-span-5">
            {rest.slice(0, 3).map((insight, index) => (
              <InsightCard key={insight.slug} insight={insight} index={index + 1} layout="row" />
            ))}
          </div>
        </div>
      </section>

      {categories.map((category, index) => {
        const items = insights.filter((insight) => insight.category === category.name);
        const service = services.find((s) => s.slug === category.serviceSlug);
        return (
          <section
            key={category.name}
            aria-labelledby={`cat-${index}`}
            className={`py-20 md:py-24 ${index % 2 === 0 ? "bg-deep" : ""}`}
          >
            <div className="page-container">
              <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                <div data-reveal className={`max-w-3xl ${practiceTone(category.name)}`}>
                  <h2 id={`cat-${index}`} className="flex items-center gap-4 text-section text-fg">
                    <span aria-hidden="true" className="size-4 shrink-0 rounded-full bg-[var(--tone)]" />
                    {category.name}
                  </h2>
                  <p className="mt-5 max-w-[42rem] text-lede text-fg-muted">{category.intro}</p>
                </div>
                {service ? (
                  <Link href={`/services/${service.slug}`} className="btn btn-ghost shrink-0">
                    {service.heading}
                  </Link>
                ) : null}
              </div>
              <div className="mt-10 grid gap-x-6 gap-y-12 md:grid-cols-2">
                {items.map((insight, i) => (
                  <InsightCard key={insight.slug} insight={insight} index={i} headingLevel="h3" />
                ))}
              </div>
            </div>
          </section>
        );
      })}

      <CtaBand title="Want these ideas applied to your organization?" />

      <JsonLd data={webPageJsonLd({ type: "CollectionPage", path: "/insights", name: "Healthcare Operations Insights and Guides", description, image: photoSrc("insights-hero") })} />
      <JsonLd data={blogJsonLd} />
    </>
  );
}
