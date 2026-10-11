"use client";

import { useCallback, useEffect, useRef, useState } from "react";

// Rendered for this site: gold tokens stamped with the Anoka mark and the three practice areas,
// with capsules and tablets, spiralling out of the distance. Each file loops seamlessly.
// The wide cut keeps the swirl on the left, beside the words; the square cut centers it for the
// space above the words on phones and tablets.
const SOURCES = { wide: "/videos/hero-wide.mp4", square: "/videos/hero-square.mp4" };

/**
 * The looping 3D animation behind the home hero. The poster under it is the first frame, so the
 * video fades in without a jump. It stays still for people who prefer reduced motion (they can
 * start it with the button), and pauses while it is scrolled out of view.
 */
export function HeroVideo() {
  const video = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [shown, setShown] = useState(false);
  const chosen = useRef(false);
  const stopped = useRef(false);

  const start = useCallback(() => {
    const element = video.current;
    if (!element) return;
    if (!chosen.current) {
      element.src = window.matchMedia("(min-width: 1024px)").matches ? SOURCES.wide : SOURCES.square;
      chosen.current = true;
    }
    element.play().catch(() => setPlaying(false));
  }, []);

  useEffect(() => {
    const element = video.current;
    if (!element) return;

    stopped.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!stopped.current) start();

    const observer = new IntersectionObserver(([entry]) => {
      if (!chosen.current || stopped.current) return;
      if (entry.isIntersecting) element.play().catch(() => {});
      else element.pause();
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, [start]);

  const toggle = () => {
    const element = video.current;
    if (!element) return;
    if (playing) {
      stopped.current = true;
      element.pause();
    } else {
      stopped.current = false;
      start();
    }
  };

  return (
    <>
      <video
        ref={video}
        aria-hidden="true"
        muted
        loop
        playsInline
        preload="none"
        onPlaying={() => {
          setPlaying(true);
          setShown(true);
        }}
        onPause={() => setPlaying(false)}
        className={`hero-media-box absolute inset-x-0 top-0 -z-10 w-full object-cover transition-opacity duration-700 ${shown ? "opacity-100" : "opacity-0"}`}
      />
      <button
        type="button"
        onClick={toggle}
        aria-label={playing ? "Pause the background animation" : "Play the background animation"}
        className="absolute right-4 bottom-24 z-10 grid size-11 place-items-center rounded-full border border-fg/25 bg-base/60 text-fg backdrop-blur transition-colors hover:border-accent hover:text-accent md:right-8 md:bottom-28"
      >
        {playing ? (
          <svg viewBox="0 0 20 20" aria-hidden="true" className="size-4 fill-current">
            <rect x="5" y="4" width="3.5" height="12" rx="1" />
            <rect x="11.5" y="4" width="3.5" height="12" rx="1" />
          </svg>
        ) : (
          <svg viewBox="0 0 20 20" aria-hidden="true" className="size-4 fill-current">
            <path d="M6 4.2v11.6a.8.8 0 001.2.7l9.4-5.8a.8.8 0 000-1.4L7.2 3.5A.8.8 0 006 4.2z" />
          </svg>
        )}
      </button>
    </>
  );
}
