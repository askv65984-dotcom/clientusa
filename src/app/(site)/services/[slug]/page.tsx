import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { CSSProperties } from "react";
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
  ImageCardGrid,
  Marquee,
  PageHero,
  PhotoBand,
  SectionHeading,
  SplitSection,
} from "@/components/site/sections";
import { insightsForService } from "@/content/insights";
import { engagementModels, getService, services } from "@/content/services";
import { getActivePackages } from "@/lib/data";
import { faqJsonLd, organizationId, pageMetadata, webPageJsonLd } from "@/lib/seo";
import { absoluteUrl } from "@/lib/site";
import { photoSrc } from "@/lib/photos";

export function generateStaticParams() {
  return services.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({ params }: PageProps<"/services/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) return {};
  return pageMetadata({
    title: service.metaTitle,
    description: service.metaDescription,
    path: `/services/${service.slug}`,
  });
}

const delay = (ms: number) => ({ "--d": `${ms}ms` }) as CSSProperties;

// Every service slug is prerendered, and the full page must be in the HTML for crawlers that do not run
// JavaScript, so the params are read up front instead of behind a streaming Suspense boundary.
export const instant = false;

export default async function ServicePage({ params }: PageProps<"/services/[slug]">) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) notFound();

  const path = `/services/${service.slug}`;
  const otherServices = services.filter((other) => other.slug !== service.slug);
  const { images } = service;
  const guides = insightsForService(service.slug);
  const prices = (await getActivePackages())
    .filter((pkg) => pkg.billing !== "custom" && pkg.price_cents != null)
    .map((pkg) => (pkg.price_cents as number) / 100);

  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${absoluteUrl(path)}#service`,
    name: service.heading,
    serviceType: service.heading,
    description: service.metaDescription,
    url: absoluteUrl(path),
    image: absoluteUrl(photoSrc(images.hero)),
    provider: { "@id": organizationId },
    areaServed: { "@type": "Country", name: "United States" },
    audience: service.whoFor.map((name) => ({ "@type": "BusinessAudience", name })),
    ...(prices.length > 0
      ? {
          offers: {
            "@type": "AggregateOffer",
            priceCurrency: "USD",
            lowPrice: Math.min(...prices).toFixed(2),
            highPrice: Math.max(...prices).toFixed(2),
            offerCount: prices.length,
            url: absoluteUrl("/pricing"),
          },
        }
      : {}),
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: `${service.heading} focus areas`,
      itemListElement: service.focusAreas.map((area) => ({
        "@type": "Offer",
        itemOffered: { "@type": "Service", name: area.title, description: area.body },
      })),
    },
  };

  return (
    <>
      {/* 1. Hero */}
      <PageHero
        image={images.hero}
        breadcrumbs={
          <Breadcrumbs
            items={[
              { name: "Home", path: "/" },
              { name: "Services", path: "/services" },
              { name: service.heading, path },
            ]}
          />
        }
        title={service.heading}
        lede={service.summary}
      >
        <Link href="/book" className="btn btn-gold">
          Book a consultation
        </Link>
        <Link href="/pricing" className="btn btn-ghost">
          See packages and fees
        </Link>
      </PageHero>

      {/* 2. Overview */}
      <SplitSection image={images.overview} kicker="Overview" title={`How we help with ${service.name.toLowerCase()}`}>
        <p className="text-lede text-fg">{service.intro}</p>
        <CheckList items={service.outcomes.slice(0, 3)} />
      </SplitSection>

      {/* 3. Focus strip */}
      <Marquee items={service.focusAreas.map((area) => area.title)} />

      {/* 4. Challenges */}
      <SplitSection image={images.challenges} reverse tone="deep" kicker="Common challenges" title="What we usually hear on the first call">
        <ul className="space-y-4">
          {service.challenges.map((challenge) => (
            <li key={challenge} className="flex gap-4 rounded-2xl border border-line bg-night/40 px-5 py-4 text-fg">
              <span aria-hidden="true" className="mt-2 size-2 shrink-0 rotate-45 bg-gold" />
              {challenge}
            </li>
          ))}
        </ul>
      </SplitSection>

      {/* 5. Who this is for */}
      <section className="page-container py-20 md:py-28">
        <SectionHeading kicker="Who this is for" title="Organizations we work with in this area" />
        <div className="mt-12">
          <ImageCardGrid columns={4} items={service.whoFor.map((title, index) => ({ image: images.whoFor[index], title }))} />
        </div>
      </section>

      {/* 6. Focus areas */}
      <section className="overflow-hidden bg-deep py-20 md:py-28">
        <div className="page-container">
          <SectionHeading kicker="Where we help" title="Our focus areas" intro="Six places where small operational changes make the biggest difference." />
          <div data-reveal className="mt-12">
            <Carousel label={`${service.name} focus areas`}>
              {service.focusAreas.map((area, index) => (
                <ImageCard key={area.title} item={{ image: images.focus[index], title: area.title, body: area.body, meta: `Focus area ${index + 1}` }} />
              ))}
            </Carousel>
          </div>
        </div>
      </section>

      {/* 7. Approach */}
      <SplitSection image={images.approach} kicker="Our approach" title="How the work unfolds">
        <ol className="space-y-6">
          {service.approach.map((step, index) => (
            <li key={step.title} className="flex gap-5">
              <span className="grid size-11 shrink-0 place-items-center rounded-full border border-gold/60 font-serif text-xl text-gold">
                {index + 1}
              </span>
              <div>
                <h3 className="font-sans text-lg font-semibold tracking-normal text-fg">{step.title}</h3>
                <p className="mt-1">{step.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </SplitSection>

      {/* 8. Deliverables */}
      <SplitSection image={images.deliverables} reverse tone="deep" kicker="What you receive" title="Deliverables your team can use">
        <p>Deliverables depend on the package you choose. These are the working documents clients most often receive.</p>
        <CheckList items={service.deliverables} />
      </SplitSection>

      {/* 9. Outcomes */}
      <PhotoBand image={images.outcomes}>
        <div className="page-container py-20 md:py-28">
          <SectionHeading kicker="What we work toward" title="The outcomes we aim for" />
          <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
            {service.outcomes.map((outcome, index) => (
              <li key={outcome} data-reveal style={delay(index * 90)} className="glass rounded-2xl p-6">
                <span className="font-serif text-3xl text-gold">0{index + 1}</span>
                <p className="mt-3 text-fg">{outcome}</p>
              </li>
            ))}
          </ul>
        </div>
      </PhotoBand>

      {/* 10. Ways to engage */}
      <section className="page-container py-20 md:py-28">
        <SectionHeading
          kicker="Ways to work together"
          title="Start small or go deep"
          intro="Begin with an initial consultation or the Operations Diagnostic. Larger work runs as a focused project or a monthly retainer."
        />
        <div className="mt-12">
          <FeatureCards items={engagementModels} />
        </div>
      </section>

      {/* 11. FAQ */}
      <FaqSection image={images.card} title={`Questions about ${service.name.toLowerCase()}`} faqs={service.faqs} />

      {/* 12. Guides */}
      {guides.length > 0 ? (
        <section aria-labelledby="guides-heading" className="bg-deep py-20 md:py-28">
          <div className="page-container">
            <SectionHeading
              kicker="Guides"
              title={`Practical guides on ${service.name.toLowerCase()}`}
              intro="Practical articles drawn from the problems we help clients solve."
              id="guides-heading"
            />
            <div className="mt-12 grid gap-6 md:grid-cols-2">
              {guides.map((guide, index) => (
                <InsightCard key={guide.slug} insight={guide} index={index} />
              ))}
            </div>
            <Link href="/insights" className="btn btn-ghost mt-10">
              All insights
            </Link>
          </div>
        </section>
      ) : null}

      {/* 13. Related services */}
      <section className="page-container py-20 md:py-28">
        <SectionHeading kicker="Related services" title="Often paired with" />
        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {otherServices.map((other, index) => (
            <div key={other.slug} data-reveal style={delay(index * 100)}>
              <ImageCard
                ratio="aspect-[16/10]"
                sizes="(min-width: 640px) 45vw, 90vw"
                item={{ image: other.images.card, title: other.heading, body: other.summary, href: `/services/${other.slug}` }}
              />
            </div>
          ))}
        </div>
      </section>

      {/* 14. Call to action */}
      <CtaBand image={images.cta} title={`Talk through your ${service.name.toLowerCase()} challenges.`} />

      <JsonLd data={webPageJsonLd({ path, name: service.metaTitle, description: service.metaDescription, image: photoSrc(images.hero) })} />
      <JsonLd data={serviceJsonLd} />
      <JsonLd data={faqJsonLd(service.faqs, path)} />
    </>
  );
}
