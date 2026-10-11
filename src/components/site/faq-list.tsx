import type { CSSProperties } from "react";

export function FaqList({ faqs }: { faqs: { question: string; answer: string }[] }) {
  return (
    <div className="border-t border-line">
      {faqs.map((faq, index) => (
        <details key={faq.question} data-reveal style={{ "--d": `${index * 70}ms` } as CSSProperties} className="group border-b border-line">
          <summary className="flex list-none items-start justify-between gap-6 py-6 text-left font-serif text-[1.3125rem] leading-snug text-fg transition-colors hover:text-accent-strong md:text-[1.4rem]">
            <span>{faq.question}</span>
            <span className="grid size-9 shrink-0 place-items-center rounded-full bg-panel text-accent transition-all duration-300 group-open:rotate-45 group-open:bg-accent group-open:text-on-accent">
              <svg viewBox="0 0 20 20" aria-hidden="true" className="size-3.5">
                <path d="M10 3v14M3 10h14" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" fill="none" />
              </svg>
            </span>
          </summary>
          <p className="max-w-[62ch] pr-12 pb-7 text-fg-muted">{faq.answer}</p>
        </details>
      ))}
    </div>
  );
}
