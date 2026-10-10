import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import { FaqList } from "./faq-list";
import { Photo, type PhotoKey } from "./photo";

const delay = (ms: number) => ({ "--d": `${ms}ms` }) as CSSProperties;

export function CheckIcon({ className = "mt-1 size-4 shrink-0 text-gold" }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true" className={className}>
      <path d="M4 10.5l4 4 8-9" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
    </svg>
  );
}

export function ArrowIcon({ className = "size-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true" className={className}>
      <path d="M4 10h11M11 5l5 5-5 5" stroke="currentColor" strokeWidth="1.75" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Full-bleed photo hero used at the top of every inner page. */
export function PageHero({
  image,
  title,
  lede,
  breadcrumbs,
  children,
  compact = false,
}: {
  image: PhotoKey;
  title: string;
  lede?: string;
  breadcrumbs?: ReactNode;
  children?: ReactNode;
  compact?: boolean;
}) {
  return (
    <section
      className={`relative isolate flex items-end overflow-hidden pt-36 ${compact ? "min-h-[52vh] pb-14 md:pb-16" : "min-h-[82vh] pb-16 md:pb-24"}`}
    >
      <div className="absolute inset-0 -z-10">
        <Photo name={image} alt="" priority sizes="100vw" className="kenburns object-cover" />
        <div className="absolute inset-0 bg-linear-to-t from-night via-night/70 to-night/35" />
        <div className="absolute inset-0 bg-linear-to-r from-night/90 via-night/45 to-transparent" />
      </div>
      <div aria-hidden="true" className="glow -left-24 top-1/3 -z-10 size-96 bg-gold/30" />
      <div className="page-container">
        {breadcrumbs ? <div className="rise">{breadcrumbs}</div> : null}
        <h1 className="rise mt-6 max-w-[20ch] text-display text-fg" style={delay(120)}>
          {title}
        </h1>
        {lede ? (
          <p className="rise mt-6 max-w-[42rem] text-lede text-fg-muted" style={delay(260)}>
            {lede}
          </p>
        ) : null}
        {children ? (
          <div className="rise mt-9 flex flex-wrap gap-3" style={delay(400)}>
            {children}
          </div>
        ) : null}
      </div>
    </section>
  );
}

export function SectionHeading({
  kicker,
  title,
  intro,
  center = false,
  id,
}: {
  kicker?: string;
  title: string;
  intro?: ReactNode;
  center?: boolean;
  id?: string;
}) {
  return (
    <div data-reveal className={center ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}>
      {kicker ? <p className="kicker">{kicker}</p> : null}
      <h2 id={id} className="mt-4 text-section text-fg">
        {title}
      </h2>
      {intro ? <div className="mt-5 text-lede text-fg-muted">{intro}</div> : null}
    </div>
  );
}

/** Photo on one side, copy on the other. */
export function SplitSection({
  image,
  imageAlt,
  reverse = false,
  tone = "night",
  kicker,
  title,
  children,
  id,
}: {
  image: PhotoKey;
  imageAlt?: string;
  reverse?: boolean;
  tone?: "night" | "deep";
  kicker?: string;
  title: string;
  children: ReactNode;
  id?: string;
}) {
  return (
    <section id={id} className={`scroll-mt-24 ${tone === "deep" ? "bg-deep" : ""}`}>
      <div className="page-container grid items-center gap-14 py-20 md:py-28 lg:grid-cols-2 lg:gap-20">
        <div data-reveal={reverse ? "right" : "left"} className={`frame ${reverse ? "frame-reverse lg:order-2" : ""}`}>
          <div className="relative z-10 aspect-[4/3] overflow-hidden rounded-[22px]">
            <Photo
              name={image}
              alt={imageAlt}
              sizes="(min-width: 1024px) 40vw, 100vw"
              className="object-cover transition-transform duration-[1400ms] ease-out hover:scale-[1.06]"
            />
          </div>
        </div>
        <div data-reveal={reverse ? "left" : "right"}>
          {kicker ? <p className="kicker">{kicker}</p> : null}
          <h2 className="mt-4 text-section text-fg">{title}</h2>
          <div className="mt-6 space-y-5 text-[1.0625rem] text-fg-muted">{children}</div>
        </div>
      </div>
    </section>
  );
}

export function CheckList({ items, columns = 1 }: { items: string[]; columns?: 1 | 2 }) {
  return (
    <ul className={`grid gap-3.5 ${columns === 2 ? "sm:grid-cols-2" : ""}`}>
      {items.map((item) => (
        <li key={item} className="flex gap-3 text-fg">
          <CheckIcon />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export type ImageCardItem = { image: PhotoKey; title: string; body?: string; href?: string; meta?: string };

/** Tall photo card with the title over a dark gradient. */
export function ImageCard({ item, sizes = "(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw", ratio = "aspect-[4/5]" }: { item: ImageCardItem; sizes?: string; ratio?: string }) {
  const inner = (
    <>
      <Photo name={item.image} alt="" sizes={sizes} className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-110" />
      <div className="absolute inset-0 bg-linear-to-t from-night via-night/55 to-night/5 transition-opacity duration-500 group-hover:opacity-90" />
      <div className="absolute inset-x-0 bottom-0 p-6">
        {item.meta ? <p className="mb-2 text-sm font-semibold text-gold">{item.meta}</p> : null}
        <h3 className="text-[1.625rem] leading-tight text-fg">{item.title}</h3>
        {item.body ? <p className="mt-2 text-[0.975rem] text-fg-muted">{item.body}</p> : null}
        {item.href ? (
          <span className="mt-4 inline-flex size-10 items-center justify-center rounded-full border border-gold/50 text-gold transition-all duration-300 group-hover:translate-x-1 group-hover:bg-gold group-hover:text-night">
            <ArrowIcon />
          </span>
        ) : null}
      </div>
    </>
  );
  const classes = `group relative block ${ratio} overflow-hidden rounded-[20px] border border-line bg-panel`;
  return item.href ? (
    <Link href={item.href} className={`${classes} no-underline`}>
      <span className="sr-only">{item.title}</span>
      {inner}
    </Link>
  ) : (
    <div className={classes}>{inner}</div>
  );
}

export function ImageCardGrid({ items, columns = 3 }: { items: ImageCardItem[]; columns?: 2 | 3 | 4 }) {
  const cols = { 2: "sm:grid-cols-2", 3: "sm:grid-cols-2 lg:grid-cols-3", 4: "sm:grid-cols-2 lg:grid-cols-4" }[columns];
  return (
    <div className={`grid gap-6 ${cols}`}>
      {items.map((item, index) => (
        <div key={item.title} data-reveal style={delay(index * 90)}>
          <ImageCard item={item} />
        </div>
      ))}
    </div>
  );
}

/** Photo-topped cards with body copy below the image. */
export function FeatureCards({ items, columns = 3 }: { items: ImageCardItem[]; columns?: 2 | 3 | 4 }) {
  const cols = { 2: "md:grid-cols-2", 3: "md:grid-cols-2 lg:grid-cols-3", 4: "sm:grid-cols-2 lg:grid-cols-4" }[columns];
  return (
    <div className={`grid gap-6 ${cols}`}>
      {items.map((item, index) => (
        <article key={item.title} data-reveal style={delay(index * 90)} className="card group relative overflow-hidden transition-colors duration-300 hover:border-gold/50">
          <div className="relative aspect-[16/10] overflow-hidden">
            <Photo name={item.image} alt="" sizes="(min-width: 1024px) 30vw, (min-width: 768px) 45vw, 90vw" className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-110" />
            <div className="absolute inset-0 bg-linear-to-t from-night/70 to-transparent" />
          </div>
          <div className="p-6">
            {item.meta ? <p className="mb-1.5 text-sm font-semibold text-gold">{item.meta}</p> : null}
            <h3 className="text-[1.5rem] leading-snug text-fg">
              {item.href ? (
                <Link href={item.href} className="text-fg no-underline after:absolute after:inset-0 hover:text-gold-strong">
                  {item.title}
                </Link>
              ) : (
                item.title
              )}
            </h3>
            {item.body ? <p className="mt-2 text-fg-muted">{item.body}</p> : null}
          </div>
        </article>
      ))}
    </div>
  );
}

/** Numbered sequence with a photo per step. Only for content that really is a sequence. */
export function Steps({ steps }: { steps: { image: PhotoKey; title: string; body: string }[] }) {
  return (
    <ol className={`grid gap-6 sm:grid-cols-2 ${steps.length === 3 ? "lg:grid-cols-3" : "lg:grid-cols-4"}`}>
      {steps.map((step, index) => (
        <li key={step.title} data-reveal style={delay(index * 120)} className="card group relative overflow-hidden">
          <div className="relative aspect-[4/3] overflow-hidden">
            <Photo name={step.image} alt="" sizes="(min-width: 1024px) 24vw, (min-width: 640px) 45vw, 90vw" className="object-cover transition-transform duration-[1200ms] group-hover:scale-110" />
            <div className="absolute inset-0 bg-linear-to-t from-panel via-panel/30 to-transparent" />
            <span className="absolute bottom-3 left-5 font-serif text-[3.5rem] leading-none text-gold">{index + 1}</span>
          </div>
          <div className="p-6 pt-3">
            <h3 className="text-[1.5rem] text-fg">{step.title}</h3>
            <p className="mt-2 text-[0.975rem] text-fg-muted">{step.body}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}

/** Wide photo band with a dark overlay. Children sit on top. */
export function PhotoBand({ image, children, className = "" }: { image: PhotoKey; children: ReactNode; className?: string }) {
  return (
    <section className={`relative isolate overflow-hidden ${className}`}>
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <Photo name={image} alt="" sizes="100vw" className="parallax object-cover" />
        <div className="absolute inset-0 bg-night/55" />
        <div className="absolute inset-0 bg-linear-to-r from-night via-night/65 to-night/10" />
      </div>
      {children}
    </section>
  );
}

export function CtaBand({
  image = "cta-consult",
  title = "Start with an initial consultation.",
  body = "Tell us what is getting in the way. We will tell you plainly whether we can help and what it would take.",
}: {
  image?: PhotoKey;
  title?: string;
  body?: string;
}) {
  return (
    <PhotoBand image={image}>
      <div className="page-container py-24 md:py-32">
        <div data-reveal className="max-w-3xl">
          <p className="kicker">Next step</p>
          <h2 className="mt-4 text-section text-fg">{title}</h2>
          <p className="mt-5 text-lede text-fg-muted">{body}</p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link href="/book" className="btn btn-gold">
              Book a consultation
            </Link>
            <Link href="/pricing" className="btn btn-ghost">
              See packages and fees
            </Link>
          </div>
        </div>
      </div>
    </PhotoBand>
  );
}

/** Questions beside a tall photo that stays in view while the list scrolls. */
export function FaqSection({
  image,
  title,
  intro,
  faqs,
  tone = "deep",
}: {
  image: PhotoKey;
  title: string;
  intro?: string;
  faqs: { question: string; answer: string }[];
  tone?: "night" | "deep";
}) {
  return (
    <section aria-labelledby="faq-heading" className={tone === "deep" ? "bg-deep" : ""}>
      <div className="page-container grid gap-12 py-20 md:py-28 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-28">
            <SectionHeading kicker="Questions" title={title} id="faq-heading" intro={intro} />
            <div data-reveal="zoom" className="frame mt-10 hidden lg:block">
              <div className="relative z-10 aspect-[4/5] overflow-hidden rounded-[22px]">
                <Photo name={image} alt="" sizes="35vw" className="object-cover" />
              </div>
            </div>
          </div>
        </div>
        <div className="lg:col-span-7">
          <div data-reveal="zoom" className="relative mb-8 aspect-[16/9] overflow-hidden rounded-[22px] lg:hidden">
            <Photo name={image} alt="" sizes="100vw" className="object-cover" />
          </div>
          <FaqList faqs={faqs} />
        </div>
      </div>
    </section>
  );
}

/** Endless strip of short phrases. */
export function Marquee({ items }: { items: string[] }) {
  const row = [...items, ...items];
  return (
    <div className="relative overflow-hidden border-y border-line bg-deep py-6" aria-label="Focus areas">
      <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-linear-to-r from-deep to-transparent" />
      <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-linear-to-l from-deep to-transparent" />
      <ul className="flex w-max animate-marquee gap-10 hover:[animation-play-state:paused]">
        {row.map((item, index) => (
          <li key={`${item}-${index}`} aria-hidden={index >= items.length} className="flex items-center gap-10 font-serif text-[1.75rem] whitespace-nowrap text-fg/85">
            {item}
            <span aria-hidden="true" className="size-2 rotate-45 bg-gold" />
          </li>
        ))}
      </ul>
    </div>
  );
}
