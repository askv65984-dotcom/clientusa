import { Photo, photos, type PhotoKey } from "./photo";

/** In-article photo with a caption. */
export function ArticleFigure({ image, caption, alt }: { image: PhotoKey; caption: string; alt?: string }) {
  return (
    <figure className="!mt-10 !mb-10">
      <div className="relative aspect-[16/9] overflow-hidden rounded-[18px] border border-line">
        <Photo name={image} alt={alt ?? photos[image].alt} sizes="(min-width: 1024px) 720px, 100vw" className="object-cover" />
      </div>
      <figcaption className="mt-3 text-[0.9375rem] text-fg-soft">{caption}</figcaption>
    </figure>
  );
}

/** Highlighted note inside an article. */
export function Callout({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <aside className="!mt-8 rounded-[18px] border border-accent/40 bg-accent/5 p-6">
      <p className="font-semibold text-accent">{title}</p>
      <div className="mt-2 text-fg">{children}</div>
    </aside>
  );
}
