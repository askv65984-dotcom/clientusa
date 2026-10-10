import type { Metadata } from "next";
import { absoluteUrl, site } from "./site";

/** Date the site content was last reviewed. Used for sitemap lastmod and WebPage dateModified. */
export const CONTENT_UPDATED = "2026-10-10";

const DEFAULT_SOCIAL_IMAGE = {
  url: "/opengraph-image",
  width: 1200,
  height: 630,
  alt: "Anoka Advisors: operations consulting for healthcare, telehealth and pharmacy",
};

type PageMetaInput = {
  title: string;
  description: string;
  path: string;
  /** Use the title as-is instead of appending the brand. */
  absoluteTitle?: boolean;
  noIndex?: boolean;
  /** Social preview image; defaults to the branded card. */
  image?: { url: string; width: number; height: number; alt: string };
  article?: { publishedTime: string; modifiedTime: string; section: string; tags: string[] };
};

export function pageMetadata({ title, description, path, absoluteTitle, noIndex, image, article }: PageMetaInput): Metadata {
  const fullTitle = absoluteTitle ? title : `${title} | ${site.name}`;
  const socialImage = image ?? DEFAULT_SOCIAL_IMAGE;
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: article ? "article" : "website",
      siteName: site.name,
      locale: "en_US",
      url: path,
      title: fullTitle,
      description,
      images: [socialImage],
      ...(article
        ? {
            publishedTime: article.publishedTime,
            modifiedTime: article.modifiedTime,
            section: article.section,
            tags: article.tags,
            authors: [site.url],
          }
        : {}),
    },
    twitter: { card: "summary_large_image", title: fullTitle, description, images: [socialImage.url] },
    ...(noIndex ? { robots: { index: false, follow: false } } : {}),
  };
}

export const organizationId = `${site.url}/#organization`;
export const websiteId = `${site.url}/#website`;

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "@id": `${absoluteUrl(items[items.length - 1]?.path ?? "/")}#breadcrumb`,
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function faqJsonLd(faqs: { question: string; answer: string }[], path?: string) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    ...(path ? { "@id": `${absoluteUrl(path)}#faq` } : {}),
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };
}

type WebPageType = "WebPage" | "AboutPage" | "ContactPage" | "CollectionPage" | "FAQPage";

/** Page-level entity tying the page to the website, organization, breadcrumb and main image. */
export function webPageJsonLd({
  type = "WebPage",
  path,
  name,
  description,
  image,
  breadcrumb = true,
  datePublished = "2026-10-10",
  dateModified = CONTENT_UPDATED,
}: {
  type?: WebPageType;
  path: string;
  name: string;
  description: string;
  image?: string;
  breadcrumb?: boolean;
  datePublished?: string;
  dateModified?: string;
}) {
  const url = absoluteUrl(path);
  return {
    "@context": "https://schema.org",
    "@type": type,
    "@id": `${url}#webpage`,
    url,
    name,
    description,
    inLanguage: "en-US",
    isPartOf: { "@id": websiteId },
    about: { "@id": organizationId },
    publisher: { "@id": organizationId },
    datePublished,
    dateModified,
    ...(image ? { primaryImageOfPage: { "@type": "ImageObject", url: absoluteUrl(image) } } : {}),
    ...(breadcrumb ? { breadcrumb: { "@id": `${url}#breadcrumb` } } : {}),
  };
}
