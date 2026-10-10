import Link from "next/link";
import type { CSSProperties } from "react";
import { formatInsightDate, type Insight } from "@/content/insights";
import { Photo } from "./photo";

/** Article card used on the Insights hub, the home page, service pages and related lists. */
export function InsightCard({ insight, index = 0, headingLevel = "h3" }: { insight: Insight; index?: number; headingLevel?: "h2" | "h3" }) {
  const Heading = headingLevel;
  return (
    <article
      data-reveal
      style={{ "--d": `${index * 90}ms` } as CSSProperties}
      className="card group relative flex flex-col overflow-hidden transition-colors duration-300 hover:border-gold/50"
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <Photo
          name={insight.image}
          alt=""
          sizes="(min-width: 1024px) 30vw, (min-width: 768px) 45vw, 90vw"
          className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-linear-to-t from-night/70 to-transparent" />
        <p className="absolute top-4 left-4 rounded-full bg-night/70 px-3 py-1 text-sm font-semibold text-gold backdrop-blur">
          {insight.category}
        </p>
      </div>
      <div className="flex flex-1 flex-col p-6">
        <Heading className="text-[1.5rem] leading-snug text-fg">
          <Link href={`/insights/${insight.slug}`} className="text-fg no-underline after:absolute after:inset-0 hover:text-gold-strong">
            {insight.title}
          </Link>
        </Heading>
        <p className="mt-3 flex-1 text-[0.975rem] text-fg-muted">{insight.description}</p>
        <p className="mt-5 flex gap-4 text-sm text-fg-soft">
          <time dateTime={insight.updated}>{formatInsightDate(insight.updated)}</time>
          <span>{insight.readMinutes} min read</span>
        </p>
      </div>
    </article>
  );
}
