import Link from "next/link";
import type { CSSProperties } from "react";

const stops = [
  "Referral and intake",
  "Scheduling",
  "Visit, in person or virtual",
  "Prescribing",
  "Pharmacy fulfillment",
  "Follow-up and refills",
];

// `from` and `to` are 1-based stop positions. Each practice covers the stretch of the path between them.
const practices = [
  { name: "Healthcare operations", href: "/services/healthcare-operations-consulting", from: 1, to: 3, color: "bg-[var(--tone-healthcare)]" },
  { name: "Telehealth", href: "/services/telehealth-consulting", from: 2, to: 4, color: "bg-[var(--tone-telehealth)]" },
  { name: "Pharmacy operations", href: "/services/pharmacy-operations-consulting", from: 4, to: 6, color: "bg-[var(--tone-pharmacy)]" },
];

const delay = (i: number) => ({ "--i": i }) as CSSProperties;

/**
 * The patient's path from referral to refill, with the stretch each practice area covers.
 * Horizontal from tablet up, vertical on phones.
 */
export function CarePathway() {
  return (
    <figure>
      <figcaption className="max-w-[34rem] text-[0.975rem] text-fg-muted">
        One patient&rsquo;s path often crosses all three areas we work in. We look at the whole path, not one
        department at a time.
      </figcaption>

      {/* Phones: vertical path */}
      <div className="mt-8 md:hidden">
        <div className="grid grid-cols-[0.75rem_0.75rem_0.75rem_1.75rem_1fr]">
          <span
            aria-hidden="true"
            className="pathway-rail col-start-4 row-start-1 row-end-6 mt-[0.55rem] mb-[-0.55rem] w-0.5 justify-self-center bg-fg/50"
          />
          {practices.map((practice, i) => (
            <span
              key={practice.name}
              aria-hidden="true"
              className={`pathway-span mt-[0.55rem] mb-[-0.55rem] w-1.5 justify-self-center rounded-full ${practice.color}`}
              style={{ ...delay(i), gridColumn: i + 1, gridRow: `${practice.from} / ${practice.to}` }}
            />
          ))}
          <ol className="contents">
            {stops.map((stop, i) => (
              <li key={stop} className="contents">
                <span
                  aria-hidden="true"
                  className="pathway-stop relative z-10 col-start-4 mt-[0.25rem] size-3 justify-self-center rounded-full border-2 border-accent bg-[var(--surface)]"
                  style={{ ...delay(i), gridRow: i + 1 }}
                />
                <span className="pathway-stop col-start-5 pb-5 pl-1 leading-snug" style={{ ...delay(i), gridRow: i + 1 }}>
                  {stop}
                </span>
              </li>
            ))}
          </ol>
        </div>
        <ul className="mt-4 space-y-2.5 border-t border-line pt-5">
          {practices.map((practice) => (
            <li key={practice.name} className="flex items-center gap-3">
              <span aria-hidden="true" className={`h-1.5 w-6 rounded-full ${practice.color}`} />
              <Link href={practice.href} className="text-link">
                {practice.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Tablet and up: horizontal path */}
      <div className="mt-10 hidden md:block">
        <ol className="relative grid grid-cols-6">
          <span aria-hidden="true" className="pathway-rail absolute top-[5px] left-[5px] h-0.5 w-[83.333%] bg-fg/50" />
          {stops.map((stop, i) => (
            <li key={stop} className="pathway-stop relative pr-5" style={delay(i)}>
              <span aria-hidden="true" className="relative z-10 block size-3 rounded-full border-2 border-accent bg-[var(--surface)]" />
              <span className="mt-4 block text-[0.975rem] leading-snug">{stop}</span>
            </li>
          ))}
        </ol>
        <ul className="mt-9 grid grid-cols-6 gap-y-5">
          {practices.map((practice, i) => (
            <li
              key={practice.name}
              style={{ gridColumn: `${practice.from} / ${practice.to}`, gridRow: i + 1 }}
              className="ml-[5px] -mr-[5px]"
            >
              <Link href={practice.href} className="text-[0.9375rem] font-semibold text-fg no-underline hover:text-accent">
                {practice.name}
              </Link>
              <span aria-hidden="true" className={`pathway-span mt-2 block h-1.5 rounded-full ${practice.color}`} style={delay(i)} />
            </li>
          ))}
        </ul>
      </div>
    </figure>
  );
}
