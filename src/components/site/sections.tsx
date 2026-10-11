import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import { FaqList } from "./faq-list";
import { BrandMark } from "./logo";
import { Photo, type PhotoKey } from "./photo";

const delay = (ms: number) => ({ "--d": `${ms}ms` }) as CSSProperties;

/** Section backgrounds: pine (the default), a deeper pine, and warm walnut. */
export type Tone = "base" | "deep" | "walnut";
const toneClass: Record<Tone, string> = { base: "bg-base", deep: "bg-deep", walnut: "bg-walnut" };

/** The practice-area color for a label such as "Telehealth", "Pharmacy" or "All practice areas". */
export function practiceTone(label: string) {
  if (/^all\b/i.test(label)) return "tone-all";
  if (/tele/i.test(label)) return "tone-telehealth";
  if (/pharm/i.test(label)) return "tone-pharmacy";
  return "tone-healthcare";
}

/** A label with a dot in its practice-area color. */
export function Tag({ label, className = "" }: { label: string; className?: string }) {
  return <span className={`tag ${practiceTone(label)} ${className}`}>{label}</span>;
}

export function CheckIcon({ className = "size-3 text-accent" }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true" className={className}>
      <path d="M4 10.5l4 4 8-9" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
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

/** A check in a soft brass circle, for lists of what is included. */
export function CheckBadge() {
  return (
    <span aria-hidden="true" className="mt-[0.2rem] grid size-5 shrink-0 place-items-center rounded-full bg-accent/15">
      <CheckIcon />
    </span>
  );
}

/**
 * A headline that rises into view word by word. Each word slides up out of its own mask, so the
 * text is in the HTML for crawlers and wraps normally.
 */
export function RevealWords({ text, start = 0, step = 65 }: { text: string; start?: number; step?: number }) {
  const words = text.split(" ");
  return (
    <>
      {words.map((word, index) => (
        <span key={index}>
          <span className="word-mask">
            <span className="word" style={{ "--wd": `${start + index * step}ms` } as CSSProperties}>
              {word}
            </span>
          </span>
          {index < words.length - 1 ? " " : null}
        </span>
      ))}
    </>
  );
}

/** How long a RevealWords headline takes to finish, so what follows can come in after it. */
export function revealEnd(text: string, start = 0, step = 65) {
  return start + text.split(" ").length * step;
}

/**
 * The top of every inner page: a wide rounded photo, with a card of words that rises over its
 * lower edge.
 */
export function HeroFrame({
  media,
  size = "page",
  children,
}: {
  media: ReactNode;
  size?: "page" | "compact";
  children: ReactNode;
}) {
  const height = {
    page: "h-[44svh] min-h-[18rem] md:h-[66vh]",
    compact: "h-[34svh] min-h-[15rem] md:h-[50vh]",
  }[size];
  return (
    <section className="px-3 pt-[5.25rem] sm:px-4 md:pt-[6.25rem]">
      <div className="hero-frame mx-auto max-w-[1880px]">
        <div className={`soft-shadow relative overflow-hidden rounded-[1.75rem] md:rounded-[2.75rem] ${height}`}>
          <div className="hero-media absolute inset-0">{media}</div>
        </div>
        <div className="page-container relative -mt-20 md:-mt-36">
          <div className="soft-shadow relative max-w-[50rem] rounded-[1.75rem] bg-panel px-6 pt-7 pb-8 sm:px-10 sm:pt-9 sm:pb-10 md:rounded-[2.25rem] md:px-12">
            {children}
          </div>
        </div>
      </div>
    </section>
  );
}

/** Photo hero used at the top of every inner page. */
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
  const after = revealEnd(title, 250);
  return (
    <HeroFrame
      size={compact ? "compact" : "page"}
      media={<Photo name={image} alt="" priority sizes="100vw" className="kenburns object-cover" />}
    >
      {breadcrumbs ? <div className="rise">{breadcrumbs}</div> : null}
      <h1 className={`max-w-[20ch] text-[clamp(2.35rem,1.5rem+2.9vw,3.9rem)] leading-[1.08] font-semibold text-fg ${breadcrumbs ? "mt-4" : ""}`}>
        <RevealWords text={title} start={250} />
      </h1>
      {lede ? (
        <p className="rise mt-5 max-w-[38rem] text-lede text-fg-muted" style={delay(after + 100)}>
          {lede}
        </p>
      ) : null}
      {children ? (
        <div className="rise mt-7 flex flex-wrap gap-3" style={delay(after + 250)}>
          {children}
        </div>
      ) : null}
    </HeroFrame>
  );
}

export function SectionHeading({
  title,
  intro,
  center = false,
  id,
}: {
  title: string;
  intro?: ReactNode;
  center?: boolean;
  id?: string;
}) {
  return (
    <div data-reveal className={center ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}>
      <h2 id={id} className="text-section text-fg">
        {title}
      </h2>
      {intro ? <div className={`mt-5 max-w-[42rem] text-lede text-fg-muted ${center ? "mx-auto" : ""}`}>{intro}</div> : null}
    </div>
  );
}

/**
 * Photo on one side, copy on the other. Facing right, the photo is an arched doorway;
 * reversed, it is a landscape speech bubble. A tinted block in the same shape sits offset behind it.
 */
export function SplitSection({
  image,
  imageAlt,
  reverse = false,
  tone = "base",
  tag,
  title,
  children,
  id,
}: {
  image: PhotoKey;
  imageAlt?: string;
  reverse?: boolean;
  tone?: Tone;
  /** A practice area, shown above the title in its color. */
  tag?: string;
  title: string;
  children: ReactNode;
  id?: string;
}) {
  return (
    <section id={id} className={`scroll-mt-24 ${toneClass[tone]}`}>
      <div className="page-container grid items-center gap-12 py-20 md:py-28 lg:grid-cols-12 lg:gap-10">
        <div
          data-reveal="zoom"
          className={reverse ? "lg:order-2 lg:col-span-6 lg:col-start-7" : "mx-auto w-full max-w-[26rem] lg:col-span-5 lg:max-w-none"}
        >
          <div className="relative">
            <div
              aria-hidden="true"
              className={`absolute inset-0 translate-x-4 translate-y-4 md:translate-x-6 md:translate-y-6 ${reverse ? "shape-bubble-r offset-clay" : "shape-arch offset-sage"}`}
            />
            <div className={`soft-shadow relative overflow-hidden bg-panel ${reverse ? "shape-bubble-r aspect-[5/4]" : "shape-arch aspect-[4/5]"}`}>
              <Photo
                name={image}
                alt={imageAlt}
                sizes={reverse ? "(min-width: 1024px) 45vw, 100vw" : "(min-width: 1024px) 36vw, 26rem"}
                className="object-cover transition-transform duration-[1400ms] ease-out hover:scale-[1.04]"
              />
            </div>
          </div>
        </div>
        <div data-reveal className={reverse ? "lg:order-1 lg:col-span-6 lg:pr-6" : "lg:col-span-6 lg:col-start-7"}>
          {tag ? <Tag label={tag} className="mb-4" /> : null}
          <h2 className="text-section text-fg">{title}</h2>
          <div className="mt-6 space-y-5 text-fg-muted">{children}</div>
        </div>
      </div>
    </section>
  );
}

export function CheckList({ items, columns = 1 }: { items: string[]; columns?: 1 | 2 }) {
  return (
    <ul className={`grid gap-3.5 ${columns === 2 ? "sm:grid-cols-2" : ""}`}>
      {items.map((item) => (
        <li key={item} className="flex gap-3.5 text-fg">
          <CheckBadge />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

/**
 * What clients tell us, set as messages. An optional reply from us closes the thread,
 * signed with the Anoka mark.
 */
export function Conversation({ lines, reply }: { lines: string[]; reply?: ReactNode }) {
  return (
    <ul className="space-y-3">
      {lines.map((line, index) => (
        <li key={line} data-reveal style={delay(index * 80)} className="flex">
          <p className="shape-bubble soft-shadow-sm max-w-[34rem] bg-panel px-5 py-3.5 text-fg">{line}</p>
        </li>
      ))}
      {reply ? (
        <li data-reveal style={delay(lines.length * 80 + 100)} className="flex items-end justify-end gap-3 pt-4">
          <div className="shape-bubble-r soft-shadow-sm max-w-[30rem] bg-accent px-5 py-3.5 font-bold text-on-accent">{reply}</div>
          <span className="theme-dark grid size-11 shrink-0 place-items-center rounded-full bg-base">
            <BrandMark className="size-7" alt="Anoka Advisors" />
          </span>
        </li>
      ) : null}
    </ul>
  );
}

/** A full section built around a Conversation: the heading and a photo on one side, the messages on the other. */
export function ConversationSection({
  id,
  title,
  intro,
  image,
  lines,
  reply,
  tone = "walnut",
  children,
}: {
  id: string;
  title: string;
  intro?: string;
  image: PhotoKey;
  lines: string[];
  reply?: ReactNode;
  tone?: Tone;
  children?: ReactNode;
}) {
  return (
    <section aria-labelledby={id} className={`py-20 md:py-28 ${toneClass[tone]}`}>
      <div className="page-container grid gap-12 lg:grid-cols-12 lg:gap-16">
        <div data-reveal className="lg:col-span-5">
          <h2 id={id} className="text-section text-fg">
            {title}
          </h2>
          {intro ? <p className="mt-5 text-lede text-fg-muted">{intro}</p> : null}
          <div className="soft-shadow shape-bubble relative mt-10 hidden aspect-[5/4] overflow-hidden bg-panel lg:block">
            <Photo name={image} alt="" sizes="(min-width: 1024px) 34vw, 1px" className="object-cover" />
          </div>
        </div>
        <div className="lg:col-span-7">
          <Conversation lines={lines} reply={reply} />
          {children}
        </div>
      </div>
    </section>
  );
}

export type ImageCardItem = { image: PhotoKey; title: string; body?: string; href?: string; meta?: string };

/** Photo with the words underneath it. Linked cards get a round arrow on the photo. */
export function ImageCard({
  item,
  sizes = "(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw",
  ratio = "aspect-[4/3]",
}: {
  item: ImageCardItem;
  sizes?: string;
  ratio?: string;
}) {
  const inner = (
    <>
      <div className={`soft-shadow relative ${ratio} overflow-hidden rounded-[1.75rem] bg-panel transition-transform duration-300 group-hover:-translate-y-1`}>
        <Photo name={item.image} alt="" sizes={sizes} className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.06]" />
        {item.href ? (
          <span
            aria-hidden="true"
            className="absolute right-4 bottom-4 grid size-11 place-items-center rounded-full bg-panel text-accent transition-colors duration-300 group-hover:bg-accent group-hover:text-on-accent"
          >
            <ArrowIcon />
          </span>
        ) : null}
      </div>
      <div className="mt-5 pr-2">
        {item.meta ? <Tag label={item.meta} className="mb-2" /> : null}
        <h3 className="text-[1.5rem] leading-snug text-fg transition-colors group-hover:text-accent-strong">{item.title}</h3>
        {item.body ? <p className="mt-2 text-fg-muted">{item.body}</p> : null}
      </div>
    </>
  );
  return item.href ? (
    <Link href={item.href} className="group block no-underline">
      {inner}
    </Link>
  ) : (
    <div className="group">{inner}</div>
  );
}

export function ImageCardGrid({ items, columns = 3 }: { items: ImageCardItem[]; columns?: 2 | 3 | 4 }) {
  const cols = { 2: "sm:grid-cols-2", 3: "sm:grid-cols-2 lg:grid-cols-3", 4: "sm:grid-cols-2 lg:grid-cols-4" }[columns];
  return (
    <div className={`grid gap-x-6 gap-y-12 ${cols}`}>
      {items.map((item, index) => (
        <div key={item.title} data-reveal style={delay(index * 90)}>
          <ImageCard item={item} />
        </div>
      ))}
    </div>
  );
}

/** Postcards: a photo set inside a panel, with the words below it. */
export function FeatureCards({ items, columns = 3 }: { items: ImageCardItem[]; columns?: 2 | 3 | 4 }) {
  const cols = { 2: "md:grid-cols-2", 3: "md:grid-cols-2 lg:grid-cols-3", 4: "sm:grid-cols-2 lg:grid-cols-4" }[columns];
  return (
    <div className={`grid gap-5 ${cols}`}>
      {items.map((item, index) => (
        <article key={item.title} data-reveal style={delay(index * 90)} className="card lift group relative flex flex-col p-2.5">
          <div className="relative aspect-[16/10] overflow-hidden rounded-[1.3rem]">
            <Photo name={item.image} alt="" sizes="(min-width: 1024px) 30vw, (min-width: 768px) 45vw, 90vw" className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.06]" />
          </div>
          <div className="px-4 pt-5 pb-5">
            {item.meta ? <Tag label={item.meta} className="mb-2" /> : null}
            <h3 className="text-[1.4rem] leading-snug text-fg">
              {item.href ? (
                <Link href={item.href} className="text-fg no-underline after:absolute after:inset-0 after:rounded-[1.75rem] hover:text-accent-strong">
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

/**
 * A sequence of steps along a dashed line, each with a round photo and its number.
 * Only for content that really is a sequence.
 */
export function Steps({ steps }: { steps: { image: PhotoKey; title: string; body: string }[] }) {
  const four = steps.length > 3;
  return (
    <div className="relative">
      <span
        aria-hidden="true"
        className={`absolute top-[4.5rem] left-[4.5rem] hidden border-t-2 border-dashed border-line-strong lg:block ${four ? "right-[calc(25%-6rem)]" : "right-[calc(33.333%-5.833rem)]"}`}
      />
      <ol className={`relative grid gap-12 sm:grid-cols-2 ${four ? "lg:grid-cols-4" : "lg:grid-cols-3"} lg:gap-8`}>
        {steps.map((step, index) => (
          <li key={step.title} data-reveal style={delay(index * 120)}>
            <div className="relative size-36">
              <div className="soft-shadow absolute inset-0 overflow-hidden rounded-full bg-panel">
                <Photo name={step.image} alt="" sizes="9rem" className="object-cover" />
              </div>
              <span className="absolute -right-1 -bottom-1 grid size-12 place-items-center rounded-full bg-accent font-serif text-[1.375rem] font-semibold text-on-accent ring-4 ring-[var(--surface)]">
                {index + 1}
              </span>
            </div>
            <h3 className="mt-7 text-[1.5rem] text-fg">{step.title}</h3>
            <p className="mt-2 max-w-[22rem] text-fg-muted">{step.body}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}

/** Wide photo band, shaded toward the side the words sit on. Children sit on top. */
export function PhotoBand({ image, children, className = "" }: { image: PhotoKey; children: ReactNode; className?: string }) {
  return (
    <section className={`theme-dark relative isolate overflow-hidden ${className}`}>
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <Photo name={image} alt="" sizes="100vw" className="parallax object-cover" />
        <div className="absolute inset-0 bg-base/30" />
        <div className="absolute inset-0 bg-linear-to-r from-base via-base/80 to-base/5" />
      </div>
      {children}
    </section>
  );
}

/** The closing invitation: a walnut panel with a photo of someone at work. */
export function CtaBand({
  image = "cta-consult",
  title = "Let’s talk about what’s getting in the way.",
  body = "Tell us what is happening. We will tell you plainly whether we can help and what it would take.",
}: {
  image?: PhotoKey;
  title?: string;
  body?: string;
}) {
  return (
    <section className="px-3 py-16 sm:px-4 md:py-24">
      <div data-reveal className="theme-dark soft-shadow mx-auto grid max-w-[78rem] overflow-hidden rounded-[2rem] bg-base md:rounded-[2.5rem] lg:grid-cols-12">
        <div className="relative aspect-[16/10] lg:order-2 lg:col-span-5 lg:aspect-auto">
          <Photo name={image} alt="" sizes="(min-width: 1024px) 40vw, 100vw" className="object-cover" />
        </div>
        <div className="px-6 py-12 sm:px-12 md:py-16 lg:col-span-7 lg:py-20 lg:pr-14">
          <h2 className="text-section text-fg">{title}</h2>
          <p className="mt-5 max-w-[36rem] text-lede text-fg-muted">{body}</p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link href="/book" className="btn btn-accent">
              Book a consultation
            </Link>
            <Link href="/pricing" className="btn btn-ghost">
              See packages and fees
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

/** Questions beside an arched photo that stays in view while the list scrolls. */
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
  tone?: Tone;
}) {
  return (
    <section aria-labelledby="faq-heading" className={toneClass[tone]}>
      <div className="page-container grid gap-12 py-20 md:py-28 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-28">
            <SectionHeading title={title} id="faq-heading" intro={intro} />
            <div data-reveal="zoom" className="relative mt-10 hidden max-w-[22rem] lg:block">
              <div aria-hidden="true" className="shape-arch offset-sage absolute inset-0 translate-x-5 translate-y-5" />
              <div className="soft-shadow shape-arch relative aspect-[4/5] overflow-hidden bg-panel">
                <Photo name={image} alt="" sizes="22rem" className="object-cover" />
              </div>
            </div>
          </div>
        </div>
        <div className="lg:col-span-7">
          <FaqList faqs={faqs} />
        </div>
      </div>
    </section>
  );
}

/** Endless strip of short phrases, separated by small brass crosses. */
export function Marquee({ items, tone = "deep" }: { items: string[]; tone?: Tone }) {
  const row = [...items, ...items];
  return (
    <div className={`relative overflow-hidden py-7 ${toneClass[tone]}`} aria-label="Focus areas">
      <ul className="flex w-max animate-marquee gap-9 hover:[animation-play-state:paused]">
        {row.map((item, index) => (
          <li key={`${item}-${index}`} aria-hidden={index >= items.length} className="flex items-center gap-9 font-serif text-[1.625rem] whitespace-nowrap text-fg/90">
            {item}
            <svg viewBox="0 0 12 12" aria-hidden="true" className="size-3 text-accent">
              <path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
            </svg>
          </li>
        ))}
      </ul>
    </div>
  );
}
