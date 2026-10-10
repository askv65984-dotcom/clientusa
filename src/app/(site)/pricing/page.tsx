import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { FeeSchedule } from "@/components/site/fee-schedule";
import { JsonLd } from "@/components/site/json-ld";
import {
  CheckList,
  CtaBand,
  FaqSection,
  PageHero,
  PhotoBand,
  SectionHeading,
  SplitSection,
  Steps,
} from "@/components/site/sections";
import { generalFaqs } from "@/content/services";
import { getActivePackages } from "@/lib/data";
import { faqJsonLd, organizationId, pageMetadata, webPageJsonLd } from "@/lib/seo";
import { absoluteUrl } from "@/lib/site";
import { photoSrc } from "@/lib/photos";

export const metadata: Metadata = pageMetadata({
  title: "Consulting Packages and Fees",
  description:
    "Fixed-fee healthcare consulting packages: an Operations Diagnostic, a monthly advisory retainer and focused projects. Compare what is included and buy online.",
  path: "/pricing",
});

const fit = [
  { title: "Choose the Operations Diagnostic if", body: "you have one pressing problem and want an expert read and written priorities within days." },
  { title: "Choose the monthly retainer if", body: "you want a senior sounding board while your own team carries out the work." },
  { title: "Choose a focused project if", body: "you need a defined deliverable, such as a launch plan, a workflow redesign or an SOP library." },
];

const included = [
  "A senior consultant on every call",
  "Confidential handling of everything you share",
  "Written deliverables you keep",
  "Clear scope and fixed fee before work begins",
  "Follow-up questions answered by email",
  "No long-term contract required",
];

const afterPurchase = [
  { image: "pr-after" as const, title: "Pay securely", body: "Checkout is handled by Stripe. Your receipt arrives by email as soon as payment goes through." },
  { image: "ct-calendar" as const, title: "Choose a time", body: "The confirmation page shows our calendar, so you book your first video session straight away." },
  { image: "step-diagnostic" as const, title: "Get to work", body: "Before the first session we send a short intake questionnaire, so the time is spent on your problem." },
];

const pricingFaqs = [
  generalFaqs[1],
  generalFaqs[3],
  {
    question: "Can our organization pay by invoice instead of card?",
    answer:
      "Mention it in a message or during your consultation. For larger projects we can arrange invoicing that fits your accounts payable process.",
  },
  {
    question: "Can I cancel the monthly retainer?",
    answer: "Yes. Contact us at any time and the retainer stops at the end of the current billing period.",
  },
  generalFaqs[4],
];

export default async function PricingPage() {
  const packages = await getActivePackages();

  const catalogJsonLd = {
    "@context": "https://schema.org",
    "@type": "OfferCatalog",
    name: "Anoka Advisors consulting packages",
    url: absoluteUrl("/pricing"),
    itemListElement: packages.map((pkg) => ({
      "@type": "Offer",
      name: pkg.name,
      description: pkg.summary,
      url: absoluteUrl(`/pricing#${pkg.slug}`),
      seller: { "@id": organizationId },
      ...(pkg.billing !== "custom" && pkg.price_cents != null
        ? {
            priceCurrency: "USD",
            price: (pkg.price_cents / 100).toFixed(2),
            ...(pkg.billing === "monthly"
              ? {
                  priceSpecification: {
                    "@type": "UnitPriceSpecification",
                    price: (pkg.price_cents / 100).toFixed(2),
                    priceCurrency: "USD",
                    unitCode: "MON",
                    referenceQuantity: { "@type": "QuantitativeValue", value: 1, unitCode: "MON" },
                  },
                }
              : {}),
          }
        : {}),
      itemOffered: { "@type": "Service", name: pkg.name, provider: { "@id": organizationId } },
    })),
  };

  return (
    <>
      {/* 1 */}
      <PageHero
        image="pr-hero"
        breadcrumbs={
          <Breadcrumbs
            items={[
              { name: "Home", path: "/" },
              { name: "Pricing", path: "/pricing" },
            ]}
          />
        }
        title="Consulting packages and fees"
        lede="Every package has a fixed fee and a clear list of what is included. If you would rather talk first, request an initial consultation."
      >
        <a href="#packages" className="btn btn-gold">
          Compare packages
        </a>
        <Link href="/book#initial" className="btn btn-ghost">
          Request an initial consultation
        </Link>
      </PageHero>

      {/* 2 */}
      <SplitSection image="pr-intro" kicker="Transparent pricing" title="Know the cost before you commit">
        <p>
          Consulting fees are often hidden behind proposals and follow-up meetings. We publish ours, so you can decide
          quickly and budget with confidence.
        </p>
        <p>Prices are fixed per package and shown in US dollars. Payment is taken securely through Stripe.</p>
      </SplitSection>

      {/* 3 */}
      <section id="packages" aria-labelledby="packages-heading" className="relative isolate scroll-mt-24 overflow-hidden bg-deep py-20 md:py-28">
        <div aria-hidden="true" className="glow left-1/2 top-10 -z-10 size-[30rem] -translate-x-1/2 bg-gold/15" />
        <div className="page-container">
          <SectionHeading center kicker="Packages" title="Choose your package" id="packages-heading" />
          <div className="mt-14">
            <FeeSchedule packages={packages} />
          </div>
        </div>
      </section>

      {/* 4 */}
      <SplitSection image="pr-compare" kicker="Which fits?" title="Which package is right for you?">
        <p>
          Every package applies to our{" "}
          <Link href="/services/healthcare-operations-consulting" className="text-link">
            healthcare operations
          </Link>
          ,{" "}
          <Link href="/services/telehealth-consulting" className="text-link">
            telehealth
          </Link>{" "}
          and{" "}
          <Link href="/services/pharmacy-operations-consulting" className="text-link">
            pharmacy operations
          </Link>{" "}
          consulting.
        </p>
        <dl className="space-y-5">
          {fit.map((item) => (
            <div key={item.title} className="rounded-2xl border border-line bg-panel/60 p-5">
              <dt className="font-serif text-[1.375rem] text-fg">{item.title}</dt>
              <dd className="mt-1">{item.body}</dd>
            </div>
          ))}
        </dl>
      </SplitSection>

      {/* 5 */}
      <SplitSection image="pr-included" reverse tone="deep" kicker="Every engagement" title="Included whichever package you choose">
        <CheckList items={included} columns={2} />
      </SplitSection>

      {/* 6 */}
      <section className="page-container py-20 md:py-28">
        <SectionHeading kicker="After checkout" title="What happens after you buy" />
        <div className="mt-12">
          <Steps steps={afterPurchase} />
        </div>
      </section>

      {/* 7 */}
      <SplitSection image="pr-security" tone="deep" kicker="Secure payments" title="Your payment details stay with Stripe">
        <p>
          Checkout runs on Stripe, a payment processor trusted by millions of businesses. Card details go straight to
          Stripe and are never stored on our systems.
        </p>
        <CheckList items={["Major credit and debit cards accepted", "Receipts and invoices emailed automatically", "Promotion codes supported at checkout"]} />
      </SplitSection>

      {/* 8 */}
      <SplitSection image="pr-invoice" reverse kicker="For organizations" title="Need a purchase order or invoice?">
        <p>
          Health systems and larger organizations often need to pay through accounts payable. Tell us in a message
          and we will arrange invoicing that fits your process.
        </p>
        <Link href="/contact" className="btn btn-ghost mt-2">
          Contact us about invoicing
        </Link>
      </SplitSection>

      {/* 9 */}
      <PhotoBand image="bk-video">
        <div className="page-container py-20 md:py-28">
          <div data-reveal className="max-w-3xl">
            <p className="kicker">Not sure yet?</p>
            <h2 className="mt-4 text-section text-fg">Talk to us first</h2>
            <p className="mt-5 text-lede text-fg-muted">
              Request an initial consultation by video. Tell us what is happening, and we will recommend the package
              that fits, or tell you honestly if we are not the right fit.
            </p>
            <Link href="/book#initial" className="btn btn-gold mt-9">
              Request an initial consultation
            </Link>
          </div>
        </div>
      </PhotoBand>

      {/* 10 */}
      <FaqSection image="pr-faq" title="Questions about fees" faqs={pricingFaqs} />

      {/* 11 */}
      <CtaBand />

      <JsonLd
        data={webPageJsonLd({
          path: "/pricing",
          name: "Consulting Packages and Fees",
          description: "Fixed-fee healthcare consulting packages with published prices.",
          image: photoSrc("pr-hero"),
        })}
      />
      {packages.length > 0 ? <JsonLd data={catalogJsonLd} /> : null}
      <JsonLd data={faqJsonLd(pricingFaqs, "/pricing")} />
    </>
  );
}
