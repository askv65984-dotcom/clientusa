"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

const OFFSETS: Record<string, string> = {
  left: "translateX(-48px)",
  right: "translateX(48px)",
  zoom: "scale(0.94)",
};

/**
 * Fades sections in as they scroll into view. Elements opt in with a data-reveal attribute.
 * The animation runs through the Web Animations API, so the server-rendered markup is never
 * modified. Content stays visible without JavaScript and for people who prefer reduced motion.
 */
export function RevealObserver() {
  const pathname = usePathname();

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    document.documentElement.classList.add("reveal-on");

    const revealed = new WeakSet<Element>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting || revealed.has(entry.target)) continue;
          const element = entry.target as HTMLElement;
          revealed.add(element);
          observer.unobserve(element);

          const from = OFFSETS[element.dataset.reveal ?? ""] ?? "translateY(32px)";
          const delay = Number.parseFloat(getComputedStyle(element).getPropertyValue("--d")) || 0;
          element.animate(
            [
              { opacity: 0, transform: from },
              { opacity: 1, transform: "none" },
            ],
            { duration: 900, delay, easing: "cubic-bezier(0.2, 0.7, 0.2, 1)", fill: "both" },
          );
          // Start any CSS animations inside (such as the care pathway) that wait for the reveal.
          for (const animation of element.getAnimations({ subtree: true })) {
            if (animation.playState === "paused") animation.play();
          }
        }
      },
      { rootMargin: "0px 0px -6% 0px", threshold: 0.08 },
    );

    document.querySelectorAll("[data-reveal]").forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [pathname]);

  return null;
}
