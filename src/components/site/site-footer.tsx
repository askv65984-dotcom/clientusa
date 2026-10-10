import Link from "next/link";
import { cacheLife } from "next/cache";
import { insights } from "@/content/insights";
import { services } from "@/content/services";
import { getSiteSettings } from "@/lib/data";
import { telHref } from "@/lib/format";
import { legalNav, mainNav } from "@/lib/site";
import { LogoMark } from "./logo";
import { NewsletterForm } from "./newsletter-form";
import { Photo } from "./photo";

async function currentYear() {
  "use cache";
  cacheLife("days");
  return new Date().getFullYear();
}

const companyLinks = [
  ...mainNav,
  { href: "/book", label: "Book a consultation" },
  { href: "/credits", label: "Photo credits" },
];

function FooterHeading({ children }: { children: string }) {
  return <h2 className="font-sans text-[0.9375rem] font-semibold tracking-normal text-gold">{children}</h2>;
}

const linkClass = "text-fg-muted no-underline transition-colors hover:text-gold";

export async function SiteFooter() {
  const [settings, year] = await Promise.all([getSiteSettings(), currentYear()]);
  const email = settings.contact_email;

  return (
    <footer className="relative isolate overflow-hidden border-t border-line bg-deep">
      <div className="absolute inset-0 -z-10 opacity-[0.07]">
        <Photo name="home-pathway" alt="" sizes="100vw" className="object-cover" />
      </div>
      <div aria-hidden="true" className="glow -right-40 -top-40 -z-10 size-[30rem] bg-gold/15" />

      {/* Newsletter */}
      <div className="page-container border-b border-line py-14 md:py-16">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-6">
            <h2 className="text-[2rem] leading-tight text-fg md:text-[2.5rem]">Notes on running better healthcare operations</h2>
            <p className="mt-3 max-w-xl text-fg-muted">
              Practical ideas on patient access, virtual care and pharmacy workflow, sent occasionally. No sales sequences.
            </p>
          </div>
          <div className="lg:col-span-5 lg:col-start-8">
            <NewsletterForm />
          </div>
        </div>
      </div>

      {/* Directory */}
      <div className="page-container grid gap-12 py-16 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8">
        <div className="sm:col-span-2 lg:col-span-3">
          <Link href="/" className="inline-flex items-center gap-3 text-fg no-underline">
            <LogoMark className="size-10" />
            <span className="font-serif text-[1.6rem] leading-none font-medium">Anoka Advisors</span>
          </Link>
          <p className="mt-5 max-w-sm text-fg-muted">
            Operations consulting for healthcare practices, telehealth programs and pharmacies across the United States.
          </p>
          <dl className="mt-7 space-y-4 text-[0.975rem]">
            <div className="flex gap-3">
              <dt className="sr-only">Email</dt>
              <svg viewBox="0 0 20 20" aria-hidden="true" className="mt-1 size-4 shrink-0 text-gold">
                <rect x="2.5" y="4.5" width="15" height="11" rx="1.5" stroke="currentColor" strokeWidth="1.5" fill="none" />
                <path d="M3 5.5l7 5.5 7-5.5" stroke="currentColor" strokeWidth="1.5" fill="none" />
              </svg>
              <dd>
                <a href={`mailto:${email}`} className={`${linkClass} break-all`}>
                  {email}
                </a>
              </dd>
            </div>
            {settings.contact_phone ? (
              <div className="flex gap-3">
                <dt className="sr-only">Phone</dt>
                <svg viewBox="0 0 20 20" aria-hidden="true" className="mt-1 size-4 shrink-0 text-gold">
                  <path d="M5 2.5h3l1.5 4-2 1.25a9 9 0 004.75 4.75L13.5 10.5l4 1.5v3a2 2 0 01-2 2A13.5 13.5 0 013 4.5a2 2 0 012-2z" stroke="currentColor" strokeWidth="1.4" fill="none" />
                </svg>
                <dd>
                  <a href={telHref(settings.contact_phone)} className={linkClass}>
                    {settings.contact_phone}
                  </a>
                </dd>
              </div>
            ) : null}
            {settings.office_hours ? (
              <div className="flex gap-3">
                <dt className="sr-only">Office hours</dt>
                <svg viewBox="0 0 20 20" aria-hidden="true" className="mt-1 size-4 shrink-0 text-gold">
                  <circle cx="10" cy="10" r="7.5" stroke="currentColor" strokeWidth="1.5" fill="none" />
                  <path d="M10 5.5V10l3 2" stroke="currentColor" strokeWidth="1.5" fill="none" />
                </svg>
                <dd className="text-fg-muted">{settings.office_hours}</dd>
              </div>
            ) : null}
            <div className="flex gap-3">
              <dt className="sr-only">Service area</dt>
              <svg viewBox="0 0 20 20" aria-hidden="true" className="mt-1 size-4 shrink-0 text-gold">
                <path d="M10 18s6-5.5 6-10a6 6 0 10-12 0c0 4.5 6 10 6 10z" stroke="currentColor" strokeWidth="1.5" fill="none" />
                <circle cx="10" cy="8" r="2" stroke="currentColor" strokeWidth="1.5" fill="none" />
              </svg>
              <dd className="text-fg-muted">Serving clients nationwide, by video and on site</dd>
            </div>
          </dl>
          {settings.linkedin_url ? (
            <a
              href={settings.linkedin_url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-7 inline-flex size-11 items-center justify-center rounded-full border border-line-strong text-fg transition-colors hover:border-gold hover:bg-gold hover:text-night"
            >
              <span className="sr-only">Anoka Advisors on LinkedIn</span>
              <svg viewBox="0 0 24 24" aria-hidden="true" className="size-5 fill-current">
                <path d="M4.98 3.5a2.5 2.5 0 11-.02 5 2.5 2.5 0 01.02-5zM3 9h4v12H3zM9 9h3.8v1.7h.05c.53-1 1.83-2.05 3.77-2.05 4.03 0 4.78 2.65 4.78 6.1V21h-4v-5.5c0-1.3-.02-3-1.83-3-1.84 0-2.12 1.43-2.12 2.9V21H9z" />
              </svg>
            </a>
          ) : null}
        </div>

        <nav aria-label="Services" className="lg:col-span-2">
          <FooterHeading>Services</FooterHeading>
          <ul className="mt-5 space-y-3">
            <li>
              <Link href="/services" className={linkClass}>
                All consulting services
              </Link>
            </li>
            {services.map((service) => (
              <li key={service.slug}>
                <Link href={`/services/${service.slug}`} className={linkClass}>
                  {service.heading}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/pricing" className={linkClass}>
                Packages and fees
              </Link>
            </li>
          </ul>
        </nav>

        <nav aria-label="Company" className="lg:col-span-2">
          <FooterHeading>Company</FooterHeading>
          <ul className="mt-5 space-y-3">
            {companyLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className={linkClass}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Guides" className="lg:col-span-3">
          <FooterHeading>Guides</FooterHeading>
          <ul className="mt-5 space-y-3">
            {insights.map((insight) => (
              <li key={insight.slug}>
                <Link href={`/insights/${insight.slug}`} className={linkClass}>
                  {insight.shortTitle}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/insights" className={linkClass}>
                All insights
              </Link>
            </li>
          </ul>
        </nav>

        <nav aria-label="Legal" className="lg:col-span-2">
          <FooterHeading>Legal</FooterHeading>
          <ul className="mt-5 space-y-3">
            {legalNav.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className={linkClass}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-8 rounded-2xl border border-line bg-night/50 p-4 text-sm text-fg-soft">
            <p className="flex items-center gap-2 font-semibold text-fg">
              <svg viewBox="0 0 20 20" aria-hidden="true" className="size-4 text-gold">
                <rect x="4" y="9" width="12" height="8" rx="1" stroke="currentColor" strokeWidth="1.5" fill="none" />
                <path d="M7 9V6.5a3 3 0 016 0V9" stroke="currentColor" strokeWidth="1.5" fill="none" />
              </svg>
              Secure payments
            </p>
            <p className="mt-1">Checkout is processed by Stripe. Card details never touch our servers.</p>
          </div>
        </nav>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-line">
        <div className="page-container flex flex-col gap-5 py-7 text-sm text-fg-soft md:flex-row md:items-center md:justify-between">
          <p className="max-w-3xl">
            &copy; {year} Anoka Advisors. All rights reserved. We provide operations consulting and do not provide legal,
            medical, billing or tax advice.
          </p>
          <a href="#top" className="inline-flex items-center gap-2 self-start whitespace-nowrap text-fg-muted no-underline hover:text-gold md:self-auto">
            Back to top
            <span className="grid size-8 place-items-center rounded-full border border-line-strong">
              <svg viewBox="0 0 20 20" aria-hidden="true" className="size-4">
                <path d="M10 16V5M5 9l5-5 5 5" stroke="currentColor" strokeWidth="1.75" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </a>
        </div>
      </div>
    </footer>
  );
}
