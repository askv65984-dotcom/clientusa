import Link from "next/link";
import type { CSSProperties } from "react";
import { priceDisplay } from "@/lib/format";
import type { Package } from "@/lib/types";
import { Photo, type PhotoKey } from "./photo";
import { CheckBadge } from "./sections";

// Packages have no photo field, so they take these in display order.
const packagePhotos: PhotoKey[] = ["pkg-1", "pkg-2", "pkg-3", "pkg-4", "pkg-5", "pkg-6"];

/** The photo for the package at this position in the list, also used on its order page. */
export function packagePhoto(index: number) {
  return packagePhotos[index % packagePhotos.length];
}

function defaultCta(pkg: Package) {
  if (pkg.billing === "monthly") return "Start the retainer";
  return "Buy now";
}

/** Packages as two-part tickets: the photo and description, then past a perforation the fee, what is included and the button. */
export function FeeSchedule({ packages }: { packages: Package[] }) {
  if (packages.length === 0) {
    return (
      <div className="card p-8 md:p-10">
        <p className="max-w-[46rem] text-lede text-fg">
          Our packages are being updated. Book a video consultation and we will walk you through current options
          and fees.
        </p>
        <Link href="/book" className="btn btn-accent mt-6">
          Book a consultation
        </Link>
      </div>
    );
  }

  return (
    <div>
      <ul className={`grid gap-6 ${packages.length >= 3 ? "lg:grid-cols-3" : "lg:grid-cols-2"} md:grid-cols-2`}>
        {packages.map((pkg, index) => {
          const price = priceDisplay(pkg.billing, pkg.price_cents);
          const ctaLabel = pkg.cta_label || defaultCta(pkg);
          const featured = Boolean(pkg.badge);
          const paper = featured ? "bg-panel-2" : "bg-panel";
          return (
            <li
              key={pkg.id}
              id={pkg.slug}
              data-reveal
              style={{ "--d": `${index * 110}ms` } as CSSProperties}
              className="group flex scroll-mt-28 flex-col transition-transform duration-500 hover:-translate-y-1.5"
            >
              {/* Top half of the ticket: what it is */}
              <div className={`ticket-top rounded-t-[1.75rem] p-2.5 pb-0 ${paper}`}>
                <div className="relative aspect-[16/9] overflow-hidden rounded-[1.3rem]">
                  <Photo
                    name={packagePhoto(index)}
                    alt=""
                    sizes="(min-width: 1024px) 30vw, (min-width: 768px) 45vw, 90vw"
                    className="object-cover transition-transform duration-[1400ms] group-hover:scale-[1.06]"
                  />
                  {pkg.badge ? (
                    <p className="absolute top-3 left-3 rounded-full bg-accent px-3.5 py-1 text-sm font-bold text-on-accent">{pkg.badge}</p>
                  ) : null}
                </div>
                <div className="px-4 pt-6 pb-8 sm:px-5">
                  <h3 className="text-[1.75rem] leading-[1.12] text-fg">{pkg.name}</h3>
                  {pkg.duration_label ? <p className="mt-2 font-bold text-accent">{pkg.duration_label}</p> : null}
                  {pkg.summary ? <p className="mt-3 text-fg-muted">{pkg.summary}</p> : null}
                </div>
              </div>

              {/* Bottom half, past the perforation: the fee, what is included and the button */}
              <div className={`ticket-bottom relative flex flex-1 flex-col rounded-b-[1.75rem] px-6 pt-7 pb-7 sm:px-7 ${paper}`}>
                <span aria-hidden="true" className={`absolute inset-x-6 top-0 border-t-2 border-dashed ${featured ? "border-accent/60" : "border-line-strong"}`} />
                <p>
                  <span className={`font-serif text-[2.75rem] leading-none font-semibold ${featured ? "text-accent" : "text-fg"}`}>{price.amount}</span>
                  <span className="ml-2 text-fg-soft">{price.unit}</span>
                </p>

                {pkg.features.length > 0 ? (
                  <>
                    <h4 className="sr-only">What is included in {pkg.name}</h4>
                    <ul className="mt-6 flex-1 space-y-3">
                      {pkg.features.map((feature) => (
                        <li key={feature} className="flex gap-3 text-[0.975rem] text-fg">
                          <CheckBadge />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </>
                ) : (
                  <div className="flex-1" />
                )}

                <div className="mt-8">
                  {pkg.billing === "custom" ? (
                    <Link href="/book" className="btn btn-ghost w-full">
                      {pkg.cta_label || "Book a consultation"}
                    </Link>
                  ) : (
                    <Link href={`/checkout/${pkg.slug}`} className={`btn w-full ${featured ? "btn-accent" : "btn-ghost"}`}>
                      {ctaLabel}
                    </Link>
                  )}
                </div>
              </div>
            </li>
          );
        })}
      </ul>
      <p className="mt-8 flex items-center justify-center gap-2 text-center text-[0.9375rem] text-fg-soft">
        <svg viewBox="0 0 20 20" aria-hidden="true" className="size-4 shrink-0 text-accent">
          <rect x="4" y="9" width="12" height="8" rx="1" stroke="currentColor" strokeWidth="1.5" fill="none" />
          <path d="M7 9V6.5a3 3 0 016 0V9" stroke="currentColor" strokeWidth="1.5" fill="none" />
        </svg>
        Secure checkout by Stripe. Prices are in US dollars.
      </p>
    </div>
  );
}
