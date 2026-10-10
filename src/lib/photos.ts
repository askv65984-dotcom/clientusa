import manifest from "@/content/images.json";

/** Public path of a photo from the manifest, for structured data, sitemaps and social tags. */
export function photoSrc(key: keyof typeof manifest) {
  return manifest[key].src;
}
