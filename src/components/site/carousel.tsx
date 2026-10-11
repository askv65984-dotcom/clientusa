"use client";

import Autoplay from "embla-carousel-autoplay";
import useEmblaCarousel from "embla-carousel-react";
import { Children, useCallback, useEffect, useState, type ReactNode } from "react";

/**
 * Swipeable carousel. Slides are rendered on the server and passed in as children.
 * Autoplay pauses on hover, focus and for people who prefer reduced motion.
 */
export function Carousel({
  children,
  label,
  autoplay = true,
  slideClassName = "basis-[86%] sm:basis-1/2 lg:basis-1/3",
}: {
  children: ReactNode;
  label: string;
  autoplay?: boolean;
  slideClassName?: string;
}) {
  const slides = Children.toArray(children);
  const [viewportRef, embla] = useEmblaCarousel(
    { loop: true, align: "start", skipSnaps: false },
    autoplay ? [Autoplay({ delay: 4800, stopOnMouseEnter: true, stopOnInteraction: false, stopOnFocusIn: true })] : [],
  );
  const [selected, setSelected] = useState(0);
  const [snaps, setSnaps] = useState<number[]>([]);

  const onSelect = useCallback(() => {
    if (!embla) return;
    setSelected(embla.selectedScrollSnap());
  }, [embla]);

  useEffect(() => {
    if (!embla) return;
    const sync = () => {
      setSnaps(embla.scrollSnapList());
      onSelect();
    };
    sync();
    embla.on("select", onSelect).on("reInit", sync);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) embla.plugins().autoplay?.stop();
    return () => {
      embla.off("select", onSelect).off("reInit", sync);
    };
  }, [embla, onSelect]);

  return (
    <div role="region" aria-roledescription="carousel" aria-label={label} className="relative">
      <div ref={viewportRef} className="overflow-hidden">
        <div className="-ml-6 flex touch-pan-y">
          {slides.map((slide, index) => (
            <div
              key={index}
              role="group"
              aria-roledescription="slide"
              aria-label={`${index + 1} of ${slides.length}`}
              className={`min-w-0 shrink-0 grow-0 pl-6 ${slideClassName}`}
            >
              {slide}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 flex items-center justify-between gap-6">
        {/* Round dots, with the current slide stretched into an oval pill. */}
        <div className="flex flex-wrap items-center gap-1">
          {snaps.map((_, index) => (
            <button
              key={index}
              type="button"
              aria-label={`Go to slide ${index + 1}`}
              aria-current={index === selected ? "true" : undefined}
              onClick={() => embla?.scrollTo(index)}
              className="group grid h-8 place-items-center px-1"
            >
              <span
                className={`block h-2.5 rounded-full transition-all duration-500 ${
                  index === selected ? "w-8 bg-accent" : "w-2.5 bg-fg/30 group-hover:bg-fg/60"
                }`}
              />
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            aria-label="Previous slide"
            onClick={() => embla?.scrollPrev()}
            className="grid size-12 place-items-center rounded-full bg-panel text-fg transition-colors hover:bg-accent hover:text-on-accent"
          >
            <svg viewBox="0 0 20 20" aria-hidden="true" className="size-5">
              <path d="M16 10H5M9 5l-5 5 5 5" stroke="currentColor" strokeWidth="1.75" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button
            type="button"
            aria-label="Next slide"
            onClick={() => embla?.scrollNext()}
            className="grid size-12 place-items-center rounded-full bg-panel text-fg transition-colors hover:bg-accent hover:text-on-accent"
          >
            <svg viewBox="0 0 20 20" aria-hidden="true" className="size-5">
              <path d="M4 10h11M11 5l5 5-5 5" stroke="currentColor" strokeWidth="1.75" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
