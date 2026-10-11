import Link from "next/link";
import type { ReactNode } from "react";
import { legalNav } from "@/lib/site";
import { webPageJsonLd } from "@/lib/seo";
import { Breadcrumbs } from "./breadcrumbs";
import { JsonLd } from "./json-ld";
import type { PhotoKey } from "./photo";
import { PageHero } from "./sections";
import { photoSrc } from "@/lib/photos";

export type LegalSection = { id: string; title: string; body: ReactNode };

export const LEGAL_UPDATED = "October 10, 2026";

/** Shared layout for legal pages: photo header, sticky contents list and numbered sections. */
export function LegalPage({
  image,
  title,
  path,
  intro,
  sections,
  description = "",
}: {
  image: PhotoKey;
  title: string;
  path: string;
  intro: ReactNode;
  sections: LegalSection[];
  /** Short summary for the page's structured data. */
  description?: string;
}) {
  return (
    <>
      <PageHero
        compact
        image={image}
        breadcrumbs={
          <Breadcrumbs
            items={[
              { name: "Home", path: "/" },
              { name: title, path },
            ]}
          />
        }
        title={title}
        lede={`Last updated ${LEGAL_UPDATED}`}
      />

      <div className="page-container grid gap-12 py-16 md:py-20 lg:grid-cols-12">
        <aside className="lg:col-span-4">
          <div className="lg:sticky lg:top-28">
            <nav aria-label="On this page" className="card p-6">
              <h2 className="font-sans text-[0.9375rem] font-semibold tracking-normal text-accent">On this page</h2>
              <ol className="mt-4 space-y-2.5 text-[0.9375rem]">
                {sections.map((section, index) => (
                  <li key={section.id} className="flex gap-3">
                    <span className="w-5 shrink-0 text-fg-soft">{index + 1}.</span>
                    <a href={`#${section.id}`} className="text-fg-muted no-underline hover:text-accent">
                      {section.title}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
            <nav aria-label="Legal pages" className="mt-6 hidden rounded-[1.75rem] border border-line p-6 lg:block">
              <h2 className="font-sans text-[0.9375rem] font-semibold tracking-normal text-fg">Other policies</h2>
              <ul className="mt-3 space-y-2 text-[0.9375rem]">
                {legalNav
                  .filter((link) => link.href !== path)
                  .map((link) => (
                    <li key={link.href}>
                      <Link href={link.href} className="text-fg-muted no-underline hover:text-accent">
                        {link.label}
                      </Link>
                    </li>
                  ))}
              </ul>
            </nav>
          </div>
        </aside>

        <article className="legal-prose lg:col-span-8">
          <div className="text-lede text-fg">{intro}</div>
          {sections.map((section, index) => (
            <section key={section.id} aria-labelledby={section.id}>
              <h2 id={section.id} className="text-fg">
                <span className="mr-3 text-accent">{index + 1}.</span>
                {section.title}
              </h2>
              {section.body}
            </section>
          ))}
          <div className="shape-bubble mt-14 bg-panel p-6">
            <p className="!mb-0">
              Questions about this policy? Email{" "}
              <a href="mailto:info@anokaadvisors.com">info@anokaadvisors.com</a> or use our{" "}
              <Link href="/contact">contact form</Link>.
            </p>
          </div>
        </article>
      </div>
      <JsonLd data={webPageJsonLd({ path, name: title, description, image: photoSrc(image) })} />
    </>
  );
}
