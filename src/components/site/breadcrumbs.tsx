import Link from "next/link";
import { breadcrumbJsonLd } from "@/lib/seo";
import { JsonLd } from "./json-ld";

export function Breadcrumbs({ items }: { items: { name: string; path: string }[] }) {
  return (
    <>
      <nav aria-label="Breadcrumb" className="text-[0.9375rem]">
        <ol className="inline-flex flex-wrap items-center gap-x-2 gap-y-1 rounded-full border border-fg/15 bg-night/40 px-4 py-1.5 backdrop-blur">
          {items.map((item, index) => {
            const last = index === items.length - 1;
            return (
              <li key={item.path} className="flex items-center gap-2">
                {last ? (
                  <span aria-current="page" className="text-gold">
                    {item.name}
                  </span>
                ) : (
                  <>
                    <Link href={item.path} className="text-fg-muted no-underline hover:text-fg">
                      {item.name}
                    </Link>
                    <span aria-hidden="true" className="text-fg-soft">
                      /
                    </span>
                  </>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
      <JsonLd data={breadcrumbJsonLd(items)} />
    </>
  );
}
