import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { startCheckout } from "@/app/actions/checkout";
import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { packagePhoto } from "@/components/site/fee-schedule";
import { Photo } from "@/components/site/photo";
import { CheckIcon, PageHero } from "@/components/site/sections";
import { SubmitButton } from "@/components/site/submit-button";
import { getActivePackages, getConsultationPackage } from "@/lib/data";
import { formatUsd } from "@/lib/format";
import { pageMetadata } from "@/lib/seo";
import type { Package } from "@/lib/types";

export async function generateStaticParams() {
  const slugs = (await getActivePackages()).filter((pkg) => pkg.billing !== "custom").map((pkg) => ({ slug: pkg.slug }));
  // Cache Components needs at least one sample; packages added later in admin render on first visit.
  return slugs.length > 0 ? slugs : [{ slug: "video-consultation" }];
}

export const metadata: Metadata = pageMetadata({
  title: "Review Your Order",
  description: "Check the package details and price, then continue to secure payment.",
  path: "/checkout",
  noIndex: true,
});

// The order is read up front, so a package that no longer exists returns a real 404.
export const instant = false;

async function findPackage(slug: string) {
  const pkg = (await getActivePackages()).find((item) => item.slug === slug);
  return pkg && pkg.billing !== "custom" && pkg.price_cents != null ? (pkg as Package & { price_cents: number }) : null;
}

function LockIcon() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-gold">
      <rect x="4" y="9" width="12" height="8" rx="1" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <path d="M7 9V6.5a3 3 0 016 0V9" stroke="currentColor" strokeWidth="1.5" fill="none" />
    </svg>
  );
}

function ProceedButton({ slug, className = "" }: { slug: string; className?: string }) {
  return (
    <form action={startCheckout} className={className}>
      <input type="hidden" name="slug" value={slug} />
      <SubmitButton label="Proceed to pay" pendingLabel="Opening secure checkout…" className="btn btn-gold w-full" />
    </form>
  );
}

export default async function OrderReviewPage({ params }: PageProps<"/checkout/[slug]">) {
  const { slug } = await params;
  const pkg = await findPackage(slug);
  if (!pkg) notFound();

  const [packages, consultation] = await Promise.all([getActivePackages(), getConsultationPackage()]);
  // The paid option on the Book a consultation page links back there instead of to Pricing.
  const isConsultation = consultation?.id === pkg.id;
  const monthly = pkg.billing === "monthly";
  const amount = formatUsd(pkg.price_cents);
  // The same photo the package card uses, so the order looks familiar.
  const photo = packagePhoto(Math.max(0, packages.findIndex((item) => item.id === pkg.id)));

  const nextSteps = [
    {
      title: monthly ? "Start your subscription" : "Pay securely",
      body: monthly
        ? "Stripe takes the first monthly payment today and emails your receipt."
        : "Stripe takes the payment and emails your receipt straight away.",
    },
    { title: "Choose your time", body: "The confirmation page shows our calendar, with your name and email filled in." },
    {
      title: "Meet by video",
      body: "Your calendar confirmation has the video link. Before the session we may send a few short questions so the time is spent on your problem.",
    },
  ];

  return (
    <>
      <PageHero
        compact
        image="pr-after"
        breadcrumbs={
          <Breadcrumbs
            items={[
              { name: "Home", path: "/" },
              { name: isConsultation ? "Book a consultation" : "Pricing", path: isConsultation ? "/book" : "/pricing" },
              { name: "Your order", path: `/checkout/${pkg.slug}` },
            ]}
          />
        }
        title="Review your order"
        lede="Check what is included and the price, then continue to secure payment."
      />

      <section className="page-container pt-14 pb-16 md:pt-20 lg:pb-24">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-start lg:gap-10">
          <div className="space-y-8 lg:col-span-7">
            <article aria-labelledby="order-item" className="card overflow-hidden">
              <div className="relative aspect-[16/7] overflow-hidden">
                <Photo name={photo} alt="" sizes="(min-width: 1024px) 55vw, 100vw" className="object-cover" />
                <div className="absolute inset-0 bg-linear-to-t from-panel via-panel/30 to-transparent" />
                {pkg.badge ? (
                  <p className="absolute top-4 left-4 rounded-full bg-gold px-3.5 py-1 text-sm font-semibold text-night">{pkg.badge}</p>
                ) : null}
              </div>
              <div className="p-6 pt-2 md:p-9 md:pt-3">
                <h2 id="order-item" className="text-[2.25rem] leading-[1.1] text-fg">
                  {pkg.name}
                </h2>
                {pkg.duration_label ? <p className="mt-2 text-gold">{pkg.duration_label}</p> : null}
                {pkg.summary ? <p className="mt-4 text-fg-muted">{pkg.summary}</p> : null}

                {pkg.features.length > 0 ? (
                  <>
                    <h3 className="mt-8 font-sans text-base font-semibold tracking-normal text-fg">What is included</h3>
                    <ul className="mt-4 space-y-3">
                      {pkg.features.map((feature) => (
                        <li key={feature} className="flex gap-3 text-fg">
                          <CheckIcon />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </>
                ) : null}
              </div>
            </article>

            <section aria-labelledby="next-steps" className="card p-6 md:p-9">
              <h2 id="next-steps" className="text-[1.75rem] leading-tight text-fg">
                What happens after you pay
              </h2>
              <ol className="mt-6 space-y-5">
                {nextSteps.map((step, index) => (
                  <li key={step.title} className="flex gap-4">
                    <span className="grid size-10 shrink-0 place-items-center rounded-full border border-gold/60 font-serif text-lg text-gold">
                      {index + 1}
                    </span>
                    <div>
                      <h3 className="font-sans text-base font-semibold tracking-normal text-fg">{step.title}</h3>
                      <p className="mt-1 text-[0.975rem] text-fg-muted">{step.body}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </section>
          </div>

          <aside aria-labelledby="order-summary" className="lg:sticky lg:top-28 lg:col-span-5">
            <div className="card p-6 md:p-8">
              <h2 id="order-summary" className="text-[1.75rem] leading-tight text-fg">
                Order summary
              </h2>

              <dl className="mt-6 border-b border-line pb-6">
                <div className="flex items-start justify-between gap-4">
                  <dt className="text-fg">
                    {pkg.name}
                    <span className="block text-[0.9375rem] text-fg-soft">{monthly ? "Monthly subscription" : "One-time payment"}</span>
                  </dt>
                  <dd className="text-fg whitespace-nowrap">
                    {amount}
                    {monthly ? <span className="text-fg-soft"> /mo</span> : null}
                  </dd>
                </div>
              </dl>

              <div className="flex items-baseline justify-between gap-4 pt-6">
                <p className="font-semibold text-fg">Due today</p>
                <p className="font-serif text-[2.5rem] leading-none text-fg">{amount}</p>
              </div>
              <p className="mt-3 text-[0.9375rem] text-fg-soft">
                {monthly ? (
                  <>
                    Then {amount} each month until you cancel. Cancel at any time and it stops at the end of the billing
                    period (see{" "}
                    <Link href="/terms#retainer" className="text-link">
                      billing terms
                    </Link>
                    ).
                  </>
                ) : (
                  "One payment, nothing renews."
                )}
              </p>
              <p className="mt-2 text-[0.9375rem] text-fg-soft">
                Any taxes are shown on the payment page, where you can also enter a promotion code.
              </p>

              <ProceedButton slug={pkg.slug} className="mt-7" />

              <p className="mt-4 flex gap-2 text-[0.9375rem] text-fg-soft">
                <LockIcon />
                Secure payment by Stripe. Card details never reach our servers.
              </p>
              <p className="mt-3 text-[0.875rem] text-fg-soft">
                By continuing, you agree to our{" "}
                <Link href="/terms" className="text-link">
                  terms of service
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="text-link">
                  privacy policy
                </Link>
                .
              </p>

              <div className="mt-6 flex flex-wrap justify-between gap-3 border-t border-line pt-5 text-[0.9375rem]">
                <Link href={isConsultation ? "/book" : "/pricing#packages"} className="text-link">
                  {isConsultation ? "Back to booking" : "Change package"}
                </Link>
                <Link href="/contact" className="text-link">
                  Questions? Contact us
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* On phones the summary sits below the details, so the pay button stays in reach at the bottom
          of the screen until the footer scrolls into view. */}
      <div className="sticky bottom-0 z-40 border-t border-line bg-night/95 backdrop-blur lg:hidden">
        <div className="page-container flex items-center justify-between gap-4 py-3">
          <p className="leading-tight">
            <span className="block text-[0.8125rem] text-fg-soft">Due today</span>
            <span className="font-serif text-[1.5rem] text-fg">{amount}</span>
          </p>
          <ProceedButton slug={pkg.slug} className="w-auto shrink-0" />
        </div>
      </div>
    </>
  );
}
