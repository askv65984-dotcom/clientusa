import { services } from "@/content/services";
import { FloatingBook } from "@/components/site/floating-book";
import { JsonLd } from "@/components/site/json-ld";
import { SiteFooter } from "@/components/site/site-footer";
import { RevealObserver } from "@/components/site/reveal-observer";
import { SiteHeader } from "@/components/site/site-header";
import { getSiteSettings } from "@/lib/data";
import { insightLinks, serviceLinks } from "@/lib/nav";
import { organizationId, websiteId } from "@/lib/seo";
import { absoluteUrl, site } from "@/lib/site";

export default async function SiteLayout({ children }: LayoutProps<"/">) {
  const settings = await getSiteSettings();

  const email = settings.contact_email || site.email;
  const organization = {
    "@context": "https://schema.org",
    "@graph": [
      {
        // Organization rather than a LocalBusiness type: the firm serves clients nationwide without a public office.
        "@type": "Organization",
        "@id": organizationId,
        name: site.name,
        url: site.url,
        logo: {
          "@type": "ImageObject",
          "@id": `${site.url}/#logo`,
          url: absoluteUrl("/brand/logo.png"),
          width: 512,
          height: 512,
          caption: site.name,
        },
        image: { "@id": `${site.url}/#logo` },
        description: site.description,
        slogan: "Operations consulting for healthcare, telehealth and pharmacy.",
        email,
        ...(settings.contact_phone ? { telephone: settings.contact_phone } : {}),
        areaServed: { "@type": "Country", name: "United States" },
        contactPoint: [
          {
            "@type": "ContactPoint",
            contactType: "customer service",
            email,
            ...(settings.contact_phone ? { telephone: settings.contact_phone } : {}),
            areaServed: "US",
            availableLanguage: ["English"],
            url: absoluteUrl("/contact"),
          },
        ],
        ...(settings.linkedin_url ? { sameAs: [settings.linkedin_url] } : {}),
        knowsAbout: [
          "Healthcare operations",
          "Patient access and scheduling",
          "Clinical workflow redesign",
          "Medical practice staffing",
          "Telehealth program development",
          "Telehealth platform selection",
          "Pharmacy operations",
          "Pharmacy workflow optimization",
          "Pharmacy inspection readiness",
          "Specialty pharmacy accreditation",
        ],
        makesOffer: services.map((service) => ({
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            "@id": `${absoluteUrl(`/services/${service.slug}`)}#service`,
            name: service.heading,
            url: absoluteUrl(`/services/${service.slug}`),
          },
        })),
      },
      {
        "@type": "WebSite",
        "@id": websiteId,
        url: site.url,
        name: site.name,
        description: site.description,
        inLanguage: "en-US",
        publisher: { "@id": organizationId },
      },
    ],
  };

  return (
    <div id="top" className="site">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[60] focus:rounded-full focus:bg-accent focus:px-5 focus:py-2.5 focus:font-semibold focus:text-on-accent"
      >
        Skip to main content
      </a>
      <SiteHeader serviceLinks={serviceLinks} insightLinks={insightLinks} />
      <main id="main">{children}</main>
      <SiteFooter />
      <FloatingBook />
      <RevealObserver />
      <JsonLd data={organization} />
    </div>
  );
}
