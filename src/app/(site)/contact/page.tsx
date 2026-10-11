import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { ContactForm } from "@/components/site/contact-form";
import { JsonLd } from "@/components/site/json-ld";
import { Photo } from "@/components/site/photo";
import { CheckList, CtaBand, FaqSection, FeatureCards, PageHero, SectionHeading, SplitSection } from "@/components/site/sections";
import { getSiteSettings } from "@/lib/data";
import { telHref } from "@/lib/format";
import { faqJsonLd, pageMetadata, webPageJsonLd } from "@/lib/seo";
import { photoSrc } from "@/lib/photos";

export const metadata: Metadata = pageMetadata({
  title: "Contact Our Healthcare Consultants",
  description:
    "Contact Anoka Advisors at info@anokaadvisors.com about healthcare, telehealth or pharmacy operations, or request a consultation online.",
  path: "/contact",
});

const contactFaqs = [
  {
    question: "Can I send a request for proposal?",
    answer: "Yes. Email it to info@anokaadvisors.com with your deadline and any forms you need completed.",
  },
  {
    question: "Can we meet in person?",
    answer: "Most work happens by video. On-site visits can be arranged when a project calls for them.",
  },
  {
    question: "Should I include patient details in my message?",
    answer: "No. Please describe the situation without names, dates of birth or any other patient information.",
  },
  {
    question: "Do you work with organizations outside the United States?",
    answer: "Our work focuses on US healthcare organizations and the US regulatory environment.",
  },
];

export default async function ContactPage() {
  const settings = await getSiteSettings();
  const email = settings.contact_email;

  return (
    <>
      {/* 1 */}
      <PageHero
        image="ct-hero"
        breadcrumbs={
          <Breadcrumbs
            items={[
              { name: "Home", path: "/" },
              { name: "Contact", path: "/contact" },
            ]}
          />
        }
        title="Contact Anoka Advisors"
        lede="Tell us a little about your organization and what you would like to change. We read every message and reply by email."
      >
        <a href="#send-message" className="btn btn-accent">
          Send a message
        </a>
        <a href={`mailto:${email}`} className="btn btn-ghost">
          {email}
        </a>
      </PageHero>

      {/* 2 */}
      <section id="send-message" aria-labelledby="message-heading" className="scroll-mt-24 py-20 md:py-24">
        <div className="page-container grid gap-12 lg:grid-cols-12">
          <div data-reveal className="card p-6 sm:p-9 lg:col-span-7">
            <h2 id="message-heading" className="mb-8 text-[2.25rem] leading-tight text-fg">
              Send us a message
            </h2>
            <ContactForm />
          </div>
          <aside className="space-y-6 lg:col-span-5">
            <div data-reveal className="shape-bubble-r relative aspect-[4/3] overflow-hidden bg-panel">
              <Photo name="ct-aside" alt="" sizes="(min-width: 1024px) 38vw, 100vw" className="object-cover" />
            </div>
            <div data-reveal className="card p-6">
              <h2 className="text-[1.625rem] text-fg">Reach us directly</h2>
              <dl className="mt-4 space-y-4">
                <div>
                  <dt className="text-[0.9375rem] text-fg-soft">Email</dt>
                  <dd>
                    <a href={`mailto:${email}`} className="text-link break-all">
                      {email}
                    </a>
                  </dd>
                </div>
                {settings.contact_phone ? (
                  <div>
                    <dt className="text-[0.9375rem] text-fg-soft">Phone</dt>
                    <dd>
                      <a href={telHref(settings.contact_phone)} className="text-link">
                        {settings.contact_phone}
                      </a>
                    </dd>
                  </div>
                ) : null}
                {settings.office_hours ? (
                  <div>
                    <dt className="text-[0.9375rem] text-fg-soft">Office hours</dt>
                    <dd className="text-fg">{settings.office_hours}</dd>
                  </div>
                ) : null}
                <div>
                  <dt className="text-[0.9375rem] text-fg-soft">Service area</dt>
                  <dd className="text-fg">Nationwide across the United States</dd>
                </div>
              </dl>
            </div>
          </aside>
        </div>
      </section>

      {/* 3 */}
      <section className="bg-deep py-20 md:py-28">
        <div className="page-container">
          <SectionHeading title="Choose what works for you" />
          <div className="mt-12">
            <FeatureCards
              items={[
                { image: "ct-email", title: "Email", body: `Write to ${email} any time. Attachments are welcome.` },
                {
                  image: "ct-phone",
                  title: "Phone",
                  body: settings.contact_phone
                    ? `Call ${settings.contact_phone}${settings.office_hours ? ` during ${settings.office_hours}` : ""}.`
                    : "Prefer to talk? Book a call and we will ring you at the time you choose.",
                },
                { image: "ct-calendar", title: "Book a consultation", body: "Request an initial consultation, or book a paid diagnostic call by video.", href: "/book" },
              ]}
            />
          </div>
        </div>
      </section>

      {/* 4 */}
      <SplitSection image="ct-response" title="After you send a message">
        <ol className="space-y-5">
          {[
            "We read your message and look at the details you shared.",
            "We reply by email with questions, first thoughts or times to talk.",
            "If talking it through would help, we suggest an initial consultation by video.",
          ].map((step, index) => (
            <li key={step} className="flex gap-4">
              <span className="grid size-10 shrink-0 place-items-center rounded-full bg-accent font-serif text-lg font-semibold text-on-accent">
                {index + 1}
              </span>
              <p className="pt-1.5">{step}</p>
            </li>
          ))}
        </ol>
      </SplitSection>

      {/* 5 */}
      <SplitSection image="ct-nationwide" reverse tone="deep" title="Wherever you are in the United States">
        <p>
          Our clients are spread across the country. Most work happens by video, and we travel when a project
          needs someone on site.
        </p>
      </SplitSection>

      {/* 6 */}
      <SplitSection image="ct-rfp" title="Sending a request for proposal?">
        <p>Email your RFP or scope document to {email}. Include your deadline and any forms you need completed.</p>
        <CheckList items={["Scope and objectives", "Timeline and decision date", "Budget range, if known", "Required forms or certifications"]} columns={2} />
      </SplitSection>

      {/* 7 */}
      <SplitSection image="ct-privacy" reverse tone="walnut" title="Please keep patient information out of messages">
        <p>
          Our forms and email are not designed for protected health information. Describe the situation without names,
          dates of birth or record numbers. If an engagement needs patient data, we agree on safeguards first.
        </p>
        <Link href="/privacy" className="text-link">
          Read our privacy policy
        </Link>
      </SplitSection>

      {/* 8 */}
      <section className="page-container py-20 md:py-28">
        <SectionHeading title="Common reasons for a first message" />
        <div className="mt-12">
          <FeatureCards
            items={[
              { image: "area-healthcare", meta: "Healthcare operations", title: "Fixing patient access", body: "Long waits, phone backlogs and schedules that do not match capacity.", href: "/services/healthcare-operations-consulting" },
              { image: "area-telehealth", meta: "Telehealth", title: "Launching or fixing telehealth", body: "Platform choices, virtual visit workflows and growth into new states.", href: "/services/telehealth-consulting" },
              { image: "area-pharmacy", meta: "Pharmacy operations", title: "Steadying pharmacy operations", body: "Wait times, inventory, staffing and inspection readiness.", href: "/services/pharmacy-operations-consulting" },
            ]}
          />
        </div>
      </section>

      {/* 9 */}
      <FaqSection image="ct-faq" title="Before you write" faqs={contactFaqs} />

      {/* 10 */}
      <CtaBand title="Rather talk it through?" body="Request an initial consultation by video and tell us what is going on." />

      <JsonLd
        data={webPageJsonLd({
          type: "ContactPage",
          path: "/contact",
          name: "Contact Anoka Advisors",
          description: "Email, message or book a call with Anoka Advisors.",
          image: photoSrc("ct-hero"),
        })}
      />
      <JsonLd data={faqJsonLd(contactFaqs, "/contact")} />
    </>
  );
}
