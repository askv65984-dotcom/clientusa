import Link from "next/link";
import type { CSSProperties } from "react";
import { formatInsightDate, type Insight } from "@/content/insights";
import { Photo } from "./photo";
import { Tag } from "./sections";

/**
 * Article card used on the Insights hub, the home page, service pages and related lists.
 * The row layout puts a small square photo beside the words, for side columns.
 */
export function InsightCard({
  insight,
  index = 0,
  headingLevel = "h3",
  layout = "stacked",
}: {
  insight: Insight;
  index?: number;
  headingLevel?: "h2" | "h3";
  layout?: "stacked" | "row";
}) {
  const Heading = headingLevel;
  const row = layout === "row";
  return (
    <article
      data-reveal
      style={{ "--d": `${index * 90}ms` } as CSSProperties}
      className={`group relative flex ${row ? "flex-col gap-5 sm:flex-row sm:items-start" : "flex-col"}`}
    >
      <div className={`relative overflow-hidden rounded-[1.75rem] bg-panel ${row ? "aspect-[4/3] sm:aspect-square sm:w-44 sm:shrink-0" : "aspect-[4/3]"}`}>
        <Photo
          name={insight.image}
          alt=""
          sizes="(min-width: 1024px) 30vw, (min-width: 768px) 45vw, 90vw"
          className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.06]"
        />
      </div>
      <div className={`flex flex-1 flex-col pr-2 ${row ? "sm:pt-1" : "pt-5"}`}>
        <Tag label={insight.category} />
        <Heading className={`mt-2.5 leading-snug text-fg ${row ? "text-[1.3rem]" : "text-[1.5rem]"}`}>
          <Link href={`/insights/${insight.slug}`} className="text-fg no-underline after:absolute after:inset-0 group-hover:text-accent-strong">
            {insight.title}
          </Link>
        </Heading>
        <p className={`mt-3 flex-1 text-fg-muted ${row ? "line-clamp-3" : ""}`}>{insight.description}</p>
        <p className="mt-4 flex gap-4 text-[0.9375rem] text-fg-soft">
          <time dateTime={insight.updated}>{formatInsightDate(insight.updated)}</time>
          <span>{insight.readMinutes} min read</span>
        </p>
      </div>
    </article>
  );
}
