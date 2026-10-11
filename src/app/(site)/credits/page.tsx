import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { photos } from "@/components/site/photo";
import { PageHero } from "@/components/site/sections";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = {
  ...pageMetadata({
    title: "Photo Credits",
    description:
      "Credits for the Pexels photographers whose work appears on the Anoka Advisors website, with links to each photographer and the original photo pages.",
    path: "/credits",
  }),
  // A list of attributions is not something people search for, so keep it out of the index.
  robots: { index: false, follow: true },
};

export default function CreditsPage() {
  const all = Object.values(photos);
  const byPhotographer = new Map<string, { url: string; count: number }>();
  for (const photo of all) {
    const entry = byPhotographer.get(photo.photographer);
    if (entry) entry.count += 1;
    else byPhotographer.set(photo.photographer, { url: photo.photographerUrl, count: 1 });
  }
  const photographers = [...byPhotographer.entries()].sort((a, b) => a[0].localeCompare(b[0]));

  return (
    <>
      <PageHero
        compact
        image="lg-credits"
        breadcrumbs={
          <Breadcrumbs
            items={[
              { name: "Home", path: "/" },
              { name: "Photo credits", path: "/credits" },
            ]}
          />
        }
        title="Photo credits"
        lede={`The ${all.length} photographs on this site come from Pexels and are used under the Pexels license. Thank you to the ${photographers.length} photographers below.`}
      />

      <section className="page-container py-16 md:py-20">
        <ul className="grid gap-x-8 gap-y-3 sm:grid-cols-2 lg:grid-cols-3">
          {photographers.map(([name, info]) => (
            <li key={name} className="flex items-baseline justify-between gap-4 border-b border-line py-3">
              <a href={info.url} target="_blank" rel="noopener noreferrer" className="text-fg no-underline hover:text-accent">
                {name}
              </a>
              <span className="text-sm text-fg-soft">
                {info.count} {info.count === 1 ? "photo" : "photos"}
              </span>
            </li>
          ))}
        </ul>

        <details className="card mt-12 p-6">
          <summary className="font-semibold text-fg">See every photo and its source</summary>
          <ul className="mt-5 space-y-2 text-[0.9375rem]">
            {all.map((photo) => (
              <li key={photo.src} className="text-fg-muted">
                <a href={photo.pexelsUrl} target="_blank" rel="noopener noreferrer" className="text-fg-muted hover:text-accent">
                  {photo.alt}
                </a>{" "}
                by {photo.photographer}
              </li>
            ))}
          </ul>
        </details>
      </section>
    </>
  );
}
