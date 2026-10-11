"use client";

import Script from "next/script";
import { useCallback, useEffect, useRef } from "react";
import { parseSchedulingUrl } from "@/lib/scheduling";
import { BookingRequestForm } from "./booking-request-form";

declare global {
  interface Window {
    Calendly?: {
      initInlineWidget: (options: { url: string; parentElement: HTMLElement }) => void;
    };
  }
}

export type Prefill = { name?: string | null; email?: string | null };

function CalendlyInline({ url, prefill }: { url: string; prefill: Prefill }) {
  const container = useRef<HTMLDivElement>(null);

  const init = useCallback(() => {
    const element = container.current;
    if (!element || !window.Calendly || element.childElementCount > 0) return;
    const embedUrl = new URL(url);
    embedUrl.searchParams.set("hide_gdpr_banner", "1");
    embedUrl.searchParams.set("primary_color", "d8b77e");
    embedUrl.searchParams.set("background_color", "13211c");
    embedUrl.searchParams.set("text_color", "ebf1ed");
    // Saves the customer typing again what they gave at checkout.
    if (prefill.name) embedUrl.searchParams.set("name", prefill.name);
    if (prefill.email) embedUrl.searchParams.set("email", prefill.email);
    window.Calendly.initInlineWidget({ url: embedUrl.toString(), parentElement: element });
  }, [url, prefill.name, prefill.email]);

  // Covers client-side navigation back to this page after the script has already loaded.
  useEffect(() => init(), [init]);

  return (
    <>
      <div ref={container} className="h-[760px] min-w-[18rem] overflow-hidden" />
      <Script src="https://assets.calendly.com/assets/external/widget.js" strategy="afterInteractive" onReady={init} />
    </>
  );
}

/** Shown after payment: the Calendly calendar, or a request form until a link is saved in admin. */
export function SchedulingEmbed({
  schedulingUrl,
  title,
  sessionId,
  prefill = {},
}: {
  schedulingUrl: string;
  title: string;
  /** The paid Stripe Checkout session, which the request form checks before saving. */
  sessionId: string;
  prefill?: Prefill;
}) {
  const link = parseSchedulingUrl(schedulingUrl);

  if (!link) return <BookingRequestForm purpose="paid" sessionId={sessionId} prefill={prefill} />;

  return (
    <div className="card overflow-hidden">
      {link.kind === "calendly" ? <CalendlyInline url={link.url} prefill={prefill} /> : null}
      {link.kind === "google-calendar" || link.kind === "google-form" ? (
        <iframe src={link.url} title={title} loading="lazy" className="block h-[760px] w-full border-0" />
      ) : null}
      {link.kind === "link" ? (
        <div className="p-6 md:p-8">
          <p className="text-lede text-fg">Choose a time on our booking page.</p>
          <a href={link.url} target="_blank" rel="noopener noreferrer" className="btn btn-accent mt-6">
            Open the booking page
          </a>
        </div>
      ) : null}
      {link.kind !== "link" ? (
        <p className="border-t border-line px-5 py-3 text-[0.9375rem] text-fg-soft">
          Calendar not loading?{" "}
          <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-link">
            Open the booking page in a new tab
          </a>
          .
        </p>
      ) : null}
    </div>
  );
}
