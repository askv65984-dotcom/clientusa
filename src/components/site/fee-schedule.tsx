import Link from "next/link";
import type { CSSProperties } from "react";
import { priceDisplay } from "@/lib/format";
import type { Package } from "@/lib/types";
import { Photo, type PhotoKey } from "./photo";
import { CheckIcon } from "./sections";

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

/** Package cards with a photo, what is included, the fee and the checkout button. */
export function FeeSchedule({ packages }: { packages: Package[] }) {
  if (packages.length === 0) {
    return (
      <div className="card p-8 md:p-10">
        <p className="max-w-[46rem] text-lede text-fg">
          Our packages are being updated. Book a video consultation and we will walk you through current options
          and fees.
        </p>
        <Link href="/book" className="btn btn-gold mt-6">
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
          return (
            <li
              key={pkg.id}
              id={pkg.slug}
              data-reveal
              style={{ "--d": `${index * 110}ms` } as CSSProperties}
              className={`group relative flex scroll-mt-28 flex-col overflow-hidden rounded-[22px] border transition-all duration-500 hover:-translate-y-1.5 ${
                featured
                  ? "border-gold/70 bg-panel shadow-[0_30px_80px_-40px_rgba(216,183,126,0.55)]"
                  : "border-line bg-panel/70 hover:border-line-strong"
              }`}
            >
              <div className="relative aspect-[16/9] overflow-hidden">
                <Photo
                  name={packagePhoto(index)}
                  alt=""
                  sizes="(min-width: 1024px) 30vw, (min-width: 768px) 45vw, 90vw"
                  className="object-cover transition-transform duration-[1400ms] group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-linear-to-t from-panel via-panel/40 to-transparent" />
                {pkg.badge ? (
                  <p className="absolute top-4 left-4 rounded-full bg-gold px-3.5 py-1 text-sm font-semibold text-night">{pkg.badge}</p>
                ) : null}
              </div>

              <div className="flex flex-1 flex-col p-7 pt-2">
                <h3 className="text-[1.875rem] leading-[1.1] text-fg">{pkg.name}</h3>
                {pkg.duration_label ? <p className="mt-2 text-[0.9375rem] text-gold">{pkg.duration_label}</p> : null}
                {pkg.summary ? <p className="mt-4 text-fg-muted">{pkg.summary}</p> : null}

                <p className="mt-6 border-t border-line pt-6">
                  <span className="font-serif text-[2.75rem] leading-none text-fg">{price.amount}</span>
                  <span className="ml-2 text-[0.9375rem] text-fg-soft">{price.unit}</span>
                </p>

                {pkg.features.length > 0 ? (
                  <>
                    <h4 className="sr-only">What is included in {pkg.name}</h4>
                    <ul className="mt-6 flex-1 space-y-3">
                      {pkg.features.map((feature) => (
                        <li key={feature} className="flex gap-3 text-[0.975rem] text-fg">
                          <CheckIcon />
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
                    <Link href={`/checkout/${pkg.slug}`} className={`btn w-full ${featured ? "btn-gold" : "btn-ghost"}`}>
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
        <svg viewBox="0 0 20 20" aria-hidden="true" className="size-4 shrink-0 text-gold">
          <rect x="4" y="9" width="12" height="8" rx="1" stroke="currentColor" strokeWidth="1.5" fill="none" />
          <path d="M7 9V6.5a3 3 0 016 0V9" stroke="currentColor" strokeWidth="1.5" fill="none" />
        </svg>
        Secure checkout by Stripe. Prices are in US dollars.
      </p>
    </div>
  );
}
