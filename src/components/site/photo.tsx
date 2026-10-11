import Image from "next/image";
import manifest from "@/content/images.json";

export type PhotoKey = keyof typeof manifest;

export const photos = manifest as Record<
  PhotoKey,
  {
    src: string;
    width: number;
    height: number;
    alt: string;
    blurDataURL: string;
    pexelsUrl: string;
    photographer: string;
    photographerUrl: string;
  }
>;

/**
 * A Pexels photo from public/images, filling its positioned parent.
 * Decorative uses pass alt="" so screen readers skip them. The photo class warms it slightly on the public site.
 */
export function Photo({
  name,
  alt,
  sizes = "100vw",
  priority = false,
  className = "object-cover",
}: {
  name: PhotoKey;
  alt?: string;
  sizes?: string;
  priority?: boolean;
  className?: string;
}) {
  const photo = photos[name];
  return (
    <Image
      src={photo.src}
      alt={alt ?? photo.alt}
      fill
      sizes={sizes}
      priority={priority}
      placeholder="blur"
      blurDataURL={photo.blurDataURL}
      className={`photo ${className}`}
    />
  );
}
