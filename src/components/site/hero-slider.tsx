"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";

const SLIDE_MS = 7000;

export type HeroSlide = { label: string; title: string; body: string; href: string };

/**
 * Home page hero: background photos cross-fade with a slow zoom while a caption card
 * names the practice area on screen. The headline itself stays fixed for search engines and screen readers.
 */
export function HeroSlider({ backgrounds, slides, children }: { backgrounds: ReactNode[]; slides: HeroSlide[]; children: ReactNode }) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const go = useCallback((index: number) => setActive((index + slides.length) % slides.length), [slides.length]);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (paused || reduced) return;
    timer.current = setTimeout(() => go(active + 1), SLIDE_MS);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [active, paused, reduced, go]);

  useEffect(() => {
    const onVisibility = () => setPaused(document.hidden);
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  const slide = slides[active];

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Our practice areas"
      className="relative isolate flex min-h-[100svh] items-end overflow-hidden pt-36 pb-14 md:items-center md:pb-24"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className="absolute inset-0 -z-10">
        {backgrounds.map((background, index) => (
          <div
            key={index}
            aria-hidden={index !== active}
            className={`absolute inset-0 transition-opacity duration-[1600ms] ease-out ${index === active ? "opacity-100" : "opacity-0"}`}
          >
            <div className={`absolute inset-0 ${index === active ? "kenburns" : ""}`}>{background}</div>
          </div>
        ))}
        <div className="absolute inset-0 bg-linear-to-t from-night via-night/55 to-night/40" />
        <div className="absolute inset-0 bg-linear-to-r from-night/95 via-night/55 to-transparent" />
      </div>
      <div aria-hidden="true" className="glow -left-32 top-1/4 -z-10 size-[28rem] bg-gold/25" />
      <div aria-hidden="true" className="glow right-0 bottom-0 -z-10 size-[24rem] bg-mint/20 [animation-delay:-6s]" />

      <div className="page-container grid w-full gap-12 lg:grid-cols-12 lg:items-end">
        <div className="lg:col-span-8">{children}</div>

        <div className="lg:col-span-4">
          <div className="glass rise rounded-[20px] p-6" style={{ "--d": "600ms" } as CSSProperties}>
            <div className="flex items-center justify-between gap-4">
              <p className="text-sm font-semibold text-gold" aria-live={paused || reduced ? "polite" : "off"}>
                {slide.label}
              </p>
              <p className="text-sm text-fg-soft">
                {active + 1} / {slides.length}
              </p>
            </div>
            {/* Reset the delay inherited from the card so each new caption appears right away. */}
            <div key={active} className="rise" style={{ "--d": "0ms" } as CSSProperties}>
              <p className="mt-3 font-serif text-[1.625rem] leading-snug text-fg">{slide.title}</p>
              <p className="mt-2 text-[0.975rem] text-fg-muted">{slide.body}</p>
              <Link href={slide.href} className="text-link mt-4 inline-block">
                Explore {slide.label.toLowerCase()}
              </Link>
            </div>
            <div className="mt-6 flex items-center gap-3">
              <div className="flex flex-1 gap-1.5">
                {slides.map((item, index) => (
                  <button
                    key={item.label}
                    type="button"
                    aria-label={`Show ${item.label}`}
                    aria-current={index === active ? "true" : undefined}
                    onClick={() => go(index)}
                    className="relative h-1 flex-1 overflow-hidden rounded-full bg-fg/20"
                  >
                    {index === active ? (
                      <span
                        key={`${active}-${paused}`}
                        className={`absolute inset-0 bg-gold ${paused || reduced ? "" : "slide-progress"}`}
                        style={{ "--slide-ms": `${SLIDE_MS}ms` } as CSSProperties}
                      />
                    ) : index < active ? (
                      <span className="absolute inset-0 bg-gold/60" />
                    ) : null}
                  </button>
                ))}
              </div>
              <button
                type="button"
                aria-label="Previous practice area"
                onClick={() => go(active - 1)}
                className="grid size-10 place-items-center rounded-full border border-line-strong text-fg hover:border-gold hover:text-gold"
              >
                <svg viewBox="0 0 20 20" aria-hidden="true" className="size-4">
                  <path d="M16 10H5M9 5l-5 5 5 5" stroke="currentColor" strokeWidth="1.75" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <button
                type="button"
                aria-label="Next practice area"
                onClick={() => go(active + 1)}
                className="grid size-10 place-items-center rounded-full border border-line-strong text-fg hover:border-gold hover:text-gold"
              >
                <svg viewBox="0 0 20 20" aria-hidden="true" className="size-4">
                  <path d="M4 10h11M11 5l5 5-5 5" stroke="currentColor" strokeWidth="1.75" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
