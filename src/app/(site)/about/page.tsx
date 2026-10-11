import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { Photo } from "@/components/site/photo";
import {
  CheckList,
  CtaBand,
  FeatureCards,
  ImageCardGrid,
  Marquee,
  PageHero,
  PhotoBand,
  SectionHeading,
  SplitSection,
  type ImageCardItem,
} from "@/components/site/sections";
import { services } from "@/content/services";
import { JsonLd } from "@/components/site/json-ld";
import { pageMetadata, webPageJsonLd } from "@/lib/seo";
import { photoSrc } from "@/lib/photos";

export const metadata: Metadata = pageMetadata({
  title: "About Our Healthcare Consulting Firm",
  description:
    "Anoka Advisors is an independent US consulting firm focused on healthcare, telehealth and pharmacy operations. Learn how we work and who we help.",
  path: "/about",
});

const principles: ImageCardItem[] = [
  { image: "ab-p1", title: "Start with the work as it is done", body: "We walk the process, read the reports and talk with the people doing the work before recommending anything." },
  { image: "ab-p2", title: "Recommend what your team can carry out", body: "Each recommendation comes with an owner, a sequence and an honest estimate of the effort involved." },
  { image: "ab-p3", title: "Respect clinical and regulatory realities", body: "Changes have to work for patients, clinicians and compliance. We bring in your clinical leaders and counsel where it matters." },
  { image: "ab-p4", title: "Report plainly", body: "Short documents, clear writing and direct answers. You always know what we found and what we suggest." },
];

export default function AboutPage() {
  return (
    <>
      {/* 1 */}
      <PageHero
        image="ab-hero"
        breadcrumbs={
          <Breadcrumbs
            items={[
              { name: "Home", path: "/" },
              { name: "About", path: "/about" },
            ]}
          />
        }
        title="About Anoka Advisors"
        lede="An independent consulting firm focused on the operational side of care: how patients get scheduled and seen, how prescriptions move from order to pickup, and how virtual care fits with everything else."
      >
        <Link href="/book" className="btn btn-accent">
          Book a consultation
        </Link>
        <Link href="/services" className="btn btn-ghost">
          Explore our services
        </Link>
      </PageHero>

      {/* 2 */}
      <SplitSection image="ab-who" title="A focused firm for the business of care">
        <p>
          Anoka Advisors works with medical practices, telehealth programs, health systems and pharmacies across the
          United States. Our work sits where clinical care meets daily operations: scheduling, staffing, workflow,
          technology and compliance.
        </p>
        <p>We keep the firm deliberately focused, so every client works directly with experienced people.</p>
      </SplitSection>

      {/* 3 */}
      <SplitSection image="ab-why" reverse tone="deep" title="Why we focus on operations">
        <p>
          Most healthcare organizations do not struggle for lack of strategy. They struggle because the daily work is
          harder than it needs to be: handoffs that drop, schedules that do not match capacity, and processes that grew
          one workaround at a time.
        </p>
        <p>
          Those problems rarely stay inside one department. A scheduling issue becomes a billing issue. A new telehealth
          service changes how prescriptions reach the pharmacy. That is why we work across all three areas.
        </p>
      </SplitSection>

      {/* 4 */}
      <section aria-labelledby="mission-heading" className="py-20 md:py-28">
        <div className="page-container">
          <div data-reveal className="max-w-[60rem]">
            <h2 id="mission-heading" className="text-lg font-bold text-accent font-sans tracking-normal">
              Make good care easier to deliver
            </h2>
            <p className="mt-5 font-serif text-[clamp(1.9rem,1.3rem+2.3vw,3.25rem)] leading-[1.15] font-medium text-fg">
              We help the people who run healthcare spend less time on workarounds and more time on patients.
            </p>
          </div>
          <div data-reveal className="mt-10 grid gap-x-10 gap-y-6 md:grid-cols-[1fr_auto] md:items-end">
            <CheckList items={["Simpler workflows for staff", "Clearer experiences for patients", "Better information for leaders"]} columns={2} />
            <p className="max-w-[24rem] text-fg-muted">
              We share what we learn in our{" "}
              <Link href="/insights" className="text-link">
                insights and guides
              </Link>
              , written for anyone running healthcare operations.
            </p>
          </div>
          <div data-reveal="zoom" className="shape-bubble relative mt-14 aspect-[16/9] overflow-hidden bg-panel md:aspect-[21/8]">
            <Photo name="ab-mission" alt="" sizes="(min-width: 1280px) 74rem, 100vw" className="parallax object-cover" />
          </div>
        </div>
      </section>

      {/* 5 */}
      <section className="bg-deep py-20 md:py-28">
        <div className="page-container">
          <SectionHeading title="Four principles behind every engagement" />
          <div className="mt-12">
            <FeatureCards items={principles} columns={4} />
          </div>
        </div>
      </section>

      {/* 6 */}
      <Marquee tone="walnut" items={["Practical", "Plain-spoken", "Independent", "Confidential", "Senior-led", "Nationwide"]} />

      {/* 7 */}
      <section className="page-container py-20 md:py-28">
        <SectionHeading title="Three connected practice areas" />
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

      {/* 8 */}
      <SplitSection image="ab-clients" reverse tone="deep" title="Who we work with">
        <CheckList
          items={[
            "Independent and multi-site medical practices",
            "Specialty clinics and ambulatory centers",
            "Telehealth programs and digital health companies",
            "Health system service lines and MSOs",
            "Independent, specialty and long-term care pharmacies",
          ]}
        />
      </SplitSection>

      {/* 9 */}
      <SplitSection image="ab-collab" title="We work alongside your team">
        <p>
          The people who do the work every day know where it breaks. We bring structure, outside perspective and
          experience from other organizations, and your team brings the detail.
        </p>
        <p>Recommendations are built with your staff, which is why they tend to stick.</p>
      </SplitSection>

      {/* 10 */}
      <SplitSection image="ab-commit" reverse tone="deep" title="What you can count on">
        <CheckList
          items={[
            "Everything you share is treated as confidential",
            "We avoid patient information unless safeguards are agreed first",
            "Fees are fixed and agreed before work begins",
            "We say so plainly when we are not the right fit",
          ]}
        />
      </SplitSection>

      {/* 11 */}
      <PhotoBand image="ab-nationwide">
        <div className="page-container py-20 md:py-28">
          <div data-reveal className="max-w-3xl">
            <h2 className="text-section text-fg">Serving organizations across the United States</h2>
            <p className="mt-5 text-lede text-fg-muted">
              Most of our work happens by video, so location is rarely a barrier. When a project calls for it,
              we visit on site.
            </p>
          </div>
        </div>
      </PhotoBand>

      {/* 12 */}
      <CtaBand />

      <JsonLd
        data={webPageJsonLd({
          type: "AboutPage",
          path: "/about",
          name: "About Anoka Advisors",
          description: "An independent US consulting firm focused on healthcare, telehealth and pharmacy operations.",
          image: photoSrc("ab-hero"),
        })}
      />
    </>
  );
}
