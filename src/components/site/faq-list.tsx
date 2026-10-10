import type { CSSProperties } from "react";

export function FaqList({ faqs }: { faqs: { question: string; answer: string }[] }) {
  return (
    <div className="space-y-3">
      {faqs.map((faq, index) => (
        <details
          key={faq.question}
          data-reveal
          style={{ "--d": `${index * 70}ms` } as CSSProperties}
          className="group rounded-2xl border border-line bg-panel/70 transition-colors duration-300 open:border-gold/50 open:bg-panel hover:border-line-strong"
        >
          <summary className="flex list-none items-start justify-between gap-6 px-6 py-5 text-left font-serif text-[1.3125rem] leading-snug text-fg">
            <span>{faq.question}</span>
            <span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-full border border-line-strong text-gold transition-all duration-300 group-open:rotate-45 group-open:border-gold group-open:bg-gold group-open:text-night">
              <svg viewBox="0 0 20 20" aria-hidden="true" className="size-3.5">
                <path d="M10 3v14M3 10h14" stroke="currentColor" strokeWidth="2" fill="none" />
              </svg>
            </span>
          </summary>
          <p className="max-w-[65ch] px-6 pb-6 text-fg-muted">{faq.answer}</p>
        </details>
      ))}
    </div>
  );
}
