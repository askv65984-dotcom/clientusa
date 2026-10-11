import type { Metadata } from "next";
import Link from "next/link";
import type { CSSProperties } from "react";
import { BookingRequestForm } from "@/components/site/booking-request-form";
import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { packagePhoto } from "@/components/site/fee-schedule";
import { JsonLd } from "@/components/site/json-ld";
import { Photo, type PhotoKey } from "@/components/site/photo";
import { CheckBadge, CheckList, FaqSection, FeatureCards, PageHero, SectionHeading, SplitSection } from "@/components/site/sections";
import { getActivePackages, getConsultationPackage } from "@/lib/data";
import { formatUsd, priceDisplay } from "@/lib/format";
import { faqJsonLd, organizationId, pageMetadata, webPageJsonLd } from "@/lib/seo";
import { photoSrc } from "@/lib/photos";
import { absoluteUrl } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Book a Consultation",
  description:
    "Request an initial video consultation with Anoka Advisors, or book a paid diagnostic call online and choose your time on our calendar.",
  path: "/book",
});

const initialSteps = [
  { title: "Request a time", body: "Choose a day, a time of day and your time zone, and add a line about what is on your mind." },
  { title: "We confirm by email", body: "We reply to confirm the exact time and send the video link with it." },
  { title: "Meet by video", body: "Join from your browser on a computer, tablet or phone. Nothing to install." },
];

const delay = (ms: number) => ({ "--d": `${ms}ms` }) as CSSProperties;

function OptionCard({
  image,
  label,
  title,
  body,
  points,
  href,
  cta,
  index,
}: {
  image: PhotoKey;
  label: string;
  title: string;
  body: string;
  points: string[];
  href: string;
  cta: string;
  index: number;
}) {
  return (
    <article data-reveal style={delay(index * 110)} className="card group flex flex-col p-2.5">
      <div className="relative aspect-[16/9] overflow-hidden rounded-[1.3rem]">
        <Photo
          name={image}
          alt=""
          sizes="(min-width: 1024px) 45vw, 100vw"
          className="object-cover transition-transform duration-[1200ms] group-hover:scale-[1.04]"
        />
      </div>
      <div className="flex flex-1 flex-col px-4 pt-6 pb-4 md:px-6 md:pb-6">
        <p className="font-bold text-accent">{label}</p>
        <h3 className="mt-1.5 text-[2rem] leading-[1.1] text-fg">{title}</h3>
        <p className="mt-3 text-fg-muted">{body}</p>
        <ul className="mt-6 flex-1 space-y-3">
          {points.map((point) => (
            <li key={point} className="flex gap-3 text-[0.975rem] text-fg">
              <CheckBadge />
              <span>{point}</span>
            </li>
          ))}
        </ul>
        <Link href={href} className="btn btn-accent mt-8 w-full">
          {cta}
        </Link>
      </div>
    </article>
  );
}

export default async function BookPage() {
  const [packages, paid] = await Promise.all([getActivePackages(), getConsultationPackage()]);
  const fee = paid?.price_cents != null ? formatUsd(paid.price_cents) : null;
  const paidPrice = paid ? priceDisplay(paid.billing, paid.price_cents) : null;

  const bookingFaqs = [
    {
      question: "What is the difference between the two options?",
      answer: paid
        ? "The initial consultation is a first conversation: you request a time and we confirm it by email. The paid diagnostic call is an in-depth working session: you pay online, then choose your time on our calendar."
        : "The initial consultation is a first conversation: you request a time and we confirm it by email.",
    },
    ...(paid && fee
      ? [{ question: "How much does the paid diagnostic call cost?", answer: `It is ${fee}, paid securely online when you book.` }]
      : []),
    {
      question: "How does the video meeting work?",
      answer: "The video link comes with your confirmation email. You join from your browser on a computer, tablet or phone.",
    },
    { question: "What if I need to reschedule?", answer: "Use the link in your confirmation email to pick a new time, or send us a message." },
    {
      question: "Which time zone are the times in?",
      answer: "Your own. Choose your time zone when you request a meeting, and our calendar shows times in your time zone automatically.",
    },
    { question: "Who will I speak with?", answer: "A senior consultant who would work on your engagement if you go ahead." },
  ];

  return (
    <>
      {/* 1 */}
      <PageHero
        image="bk-hero"
        breadcrumbs={
          <Breadcrumbs
            items={[
              { name: "Home", path: "/" },
              { name: "Book a consultation", path: "/book" },
            ]}
          />
        }
        title="Book a consultation"
        lede={
          paid
            ? "Two ways to start: request an initial consultation, or book a paid diagnostic call. Both are held by video."
            : "Request an initial consultation by video. Tell us what is going on and when suits you."
        }
      >
        <a href="#initial" className="btn btn-accent">
          Request an initial consultation
        </a>
        {paid ? (
          <a href="#options" className="btn btn-ghost">
            Book a paid diagnostic call
          </a>
        ) : null}
      </PageHero>

      {/* 2 */}
      <section id="options" aria-labelledby="options-heading" className="scroll-mt-24 py-20 md:py-24">
        <div className="page-container">
          <SectionHeading center title="Choose the option that fits" id="options-heading" />
          <div className={`mx-auto mt-12 grid gap-6 ${paid ? "lg:grid-cols-2" : "max-w-2xl"}`}>
            <OptionCard
              index={0}
              image="bk-expect"
              label="Request a meeting"
              title="Initial consultation"
              body="A first video conversation about what is happening and whether we can help. Choose a day and time, and we confirm by email."
              points={["Video meeting with a senior consultant", "Pick a day and time that suit you", "Confirmed by email, with the video link"]}
              href="#initial"
              cta="Request a meeting"
            />
            {paid && paidPrice ? (
              <OptionCard
                index={1}
                image={packagePhoto(Math.max(0, packages.findIndex((pkg) => pkg.id === paid.id)))}
                label={`${paidPrice.amount}, ${paidPrice.unit}${paid.duration_label ? `. ${paid.duration_label}` : ""}`}
                title="Paid diagnostic call"
                body={paid.summary || "A paid, in-depth working session by video."}
                points={[...paid.features, "Pay online, then choose your time on our calendar"]}
                href={`/checkout/${paid.slug}`}
                cta={paid.cta_label || "Book and pay"}
              />
            ) : null}
          </div>
        </div>
      </section>

      {/* 3 */}
      <section id="initial" aria-labelledby="initial-heading" className="scroll-mt-24 bg-deep py-20 md:py-24">
        <div className="page-container grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <SectionHeading title="Request a time that suits you" id="initial-heading" />
            <div data-reveal className="shape-bubble relative mt-8 aspect-[4/3] overflow-hidden bg-panel">
              <Photo name="bk-video" alt="" sizes="(min-width: 1024px) 30vw, 100vw" className="object-cover" />
            </div>
            <ol className="mt-8 space-y-5">
              {initialSteps.map((item, index) => (
                <li key={item.title} data-reveal style={delay(index * 100)} className="flex gap-4">
                  <span className="grid size-10 shrink-0 place-items-center rounded-full bg-accent font-serif text-lg font-semibold text-on-accent">
                    {index + 1}
                  </span>
                  <div>
                    <h3 className="font-sans text-base font-bold tracking-normal text-fg">{item.title}</h3>
                    <p className="mt-1 text-[0.975rem] text-fg-muted">{item.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
          <div data-reveal className="lg:col-span-8">
            <BookingRequestForm purpose="initial" />
          </div>
        </div>
      </section>

      {/* 4 */}
      <section className="py-20 md:py-28">
        <div className="page-container">
          <SectionHeading title="Video meetings, and secure payment for paid sessions" />
          <div className="mt-12">
            <FeatureCards
              columns={2}
              items={[
                { image: "bk-hero", title: "Join from your browser", body: "The video link comes with your confirmation. There is nothing to download or install." },
                {
                  image: "bk-pay",
                  title: "Pay through Stripe",
                  body: "Paid sessions are paid online when you book. Card details go straight to Stripe and are never stored on our systems.",
                },
              ]}
            />
          </div>
        </div>
      </section>

      {/* 5 and 6: before the meeting, and during it */}
      <section className="bg-walnut py-20 md:py-28">
        <div className="page-container grid gap-5 md:grid-cols-2">
          {[
            {
              image: "bk-prepare" as const,
              title: "How to get the most from your meeting",
              items: [
                "Jot down the one or two problems that matter most right now",
                "Note any numbers you track, such as wait times or volume",
                "Think about what a good outcome would look like in six months",
                "Leave out any patient information",
              ],
            },
            {
              image: "bk-cover" as const,
              title: "What we will cover",
              items: [
                "What is happening today and how long it has been going on",
                "What you have already tried",
                "Where the problem shows up for patients and staff",
                "What to do next, and whether further work would help",
              ],
            },
          ].map((panel, index) => (
            <article key={panel.title} data-reveal style={delay(index * 110)} className="card p-2.5">
              <div className="relative aspect-[16/9] overflow-hidden rounded-[1.3rem]">
                <Photo name={panel.image} alt="" sizes="(min-width: 768px) 45vw, 100vw" className="object-cover" />
              </div>
              <div className="px-4 pt-7 pb-5 md:px-6 md:pb-7">
                <h2 className="text-[1.875rem] leading-tight text-fg">{panel.title}</h2>
                <div className="mt-6">
                  <CheckList items={panel.items} />
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* 7 */}
      <SplitSection image="bk-after" title="What happens next">
        <p>
          After an initial consultation, we follow up by email with the next step we recommend. If a larger piece of work
          makes sense, we explain which package fits and what it includes. You can buy it online when you are ready, or ask
          us to arrange an invoice.
        </p>
        <p>If we are not the right fit for what you need, we will say so and, where we can, suggest where to look instead.</p>
      </SplitSection>

      {/* 8 */}
      <SplitSection image="bk-who" reverse tone="deep" title="A consultation is a good fit for">
        <CheckList
          items={[
            "Practice owners and administrators",
            "Clinic and operations managers",
            "Telehealth program and product leads",
            "Pharmacy owners and pharmacy managers",
            "Health system and MSO operations leaders",
          ]}
        />
      </SplitSection>

      {/* 9 */}
      <FaqSection image="bk-faq" title="Booking questions" faqs={bookingFaqs} tone="base" />

      {/* 10 */}
      <SplitSection image="bk-contact" tone="deep" title="Send a message instead">
        <p>
          If you would like to check something before booking, or you need to pay by invoice, send us a message. You can
          also browse our{" "}
          <Link href="/insights" className="text-link">
            practical guides
          </Link>{" "}
          or compare{" "}
          <Link href="/pricing" className="text-link">
            packages and fees
          </Link>{" "}
          while you decide.
        </p>
        <Link href="/contact" className="btn btn-ghost mt-2">
          Send a message
        </Link>
      </SplitSection>

      <JsonLd
        data={webPageJsonLd({
          path: "/book",
          name: "Book a Consultation",
          description: "Request an initial video consultation, or book a paid diagnostic call online.",
          image: photoSrc("bk-hero"),
        })}
      />
      {paid?.price_cents != null ? (
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "Service",
            "@id": `${absoluteUrl("/book")}#paid-session`,
            name: paid.name,
            description: paid.summary || undefined,
            serviceType: "Healthcare operations consulting",
            areaServed: { "@type": "Country", name: "United States" },
            provider: { "@id": organizationId },
            offers: {
              "@type": "Offer",
              price: (paid.price_cents / 100).toFixed(2),
              priceCurrency: "USD",
              availability: "https://schema.org/InStock",
              url: absoluteUrl("/book"),
            },
          }}
        />
      ) : null}
      <JsonLd data={faqJsonLd(bookingFaqs, "/book")} />
    </>
  );
}
