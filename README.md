# Anoka Advisors website

Marketing site, online checkout and admin area for Anoka Advisors (anokaadvisors.com).

- **Stack:** Next.js 16 (App Router, Cache Components), Tailwind CSS 4, Supabase (database and admin login), Stripe Checkout, Calendly or Google booking embed, Embla carousels.
- **Design:** dark theme (deep green and brass gold), Newsreader and Public Sans, 151 optimized Pexels photos, a hero slider, swipeable carousels, scroll-reveal animations, parallax photo bands, animated counters, a scrolling text strip and a reading-progress bar. Every animation stops for visitors who choose reduced motion.
- **Public pages:** Home, Services, three service pages, Pricing, About, Book a consultation, Contact (10 to 14 photo sections each), plus Privacy, Terms, Cookies, Accessibility, Professional disclaimer and Photo credits.
- **Admin (`/admin`):** edit packages and prices, show or hide packages, choose the paid booking option, manage contact-form messages and meeting requests, see Stripe orders, export newsletter subscribers, and set the booking link, email, phone, office hours and LinkedIn page.

## Current status

| Piece | Status |
| --- | --- |
| Supabase database | Set up in project `usaclientanokaadvisor` (schema, security rules, 3 starter packages, settings) |
| Admin sign-in | PIN only, at `/admin`. Change the PIN in Admin > Settings |
| Contact form, newsletter, admin | Working against the live database |
| Stripe checkout | **Needs keys.** Until `STRIPE_SECRET_KEY` is set, Buy buttons show a "checkout unavailable" page |
| Book a consultation | Two options: an **initial consultation** requested through a form (working now), and a **paid session** (the Operations Diagnostic) bought online. Payment needs Stripe keys |
| Booking calendar | **Needs a Calendly link.** Shown only after payment. Until it is added, paying customers get a short form to request a time |

## 1. Supabase (done)

All migrations in `supabase/migrations/` have been applied, and sign-ups are disabled.

**How admin sign-in works:** the login page asks only for a PIN. The server checks it against a scrypt hash in `admin_secrets` (readable only with the secret key), then starts a Supabase session for `info@anokaadvisors.com` using `ADMIN_EMAIL` and `ADMIN_PASSWORD` from the environment. Five wrong PINs from one IP, or 30 in total, lock sign-in for 15 minutes. Database security rules still require that account to be listed in `admin_users`.

**Forgot the PIN?** Set a new one from the SQL editor by replacing `admin_secrets.pin_hash`, or ask your developer to run the PIN script again.

## 2. Stripe

1. Copy the **secret key** from the Stripe dashboard (`sk_test_…` while testing) into `STRIPE_SECRET_KEY`.
2. **Developers > Webhooks > Add endpoint:** `https://anokaadvisors.com/api/stripe/webhook` with these events:
   `checkout.session.completed`, `checkout.session.async_payment_succeeded`, `checkout.session.async_payment_failed`, `customer.subscription.updated`, `customer.subscription.deleted`, `charge.refunded`.
   Put the signing secret (`whsec_…`) in `STRIPE_WEBHOOK_SECRET`.
3. **Settings > Customer emails:** turn on receipts for successful payments.

Every buy button opens an order page first (`/checkout/<package-slug>`) with what is included, the price, billing terms and what happens next. **Proceed to pay** there opens Stripe Checkout. Prices come from the database at that moment, so nothing needs to be created in Stripe's product catalog. To test webhooks locally, run `stripe listen --forward-to localhost:3000/api/stripe/webhook`.

## 3. Booking options and Calendly

The **Book a consultation** page (`/book`) offers two options:

1. **Initial consultation.** The visitor picks a weekday in the next two weeks, a time of day and their time zone, and sends the request. It appears in **Admin > Leads** as "Initial consultation", with **Add to Google Calendar** and **Reply by email** buttons. Reply to confirm the time and send the video link. No payment is taken.
2. **Paid session.** The package chosen under **Admin > Settings > Paid option on the Book a consultation page** (currently the Operations Diagnostic). The visitor checks the order page, chooses **Proceed to pay**, pays through Stripe, and the confirmation page shows your Calendly calendar with their name and email filled in.

Change the paid option's price, length and what is included under **Packages and prices**.

**Calendly setup:** create an event for the paid session (for example "Operations Diagnostic", 90 minutes) with **Zoom** or **Google Meet** as the location, and set it to **secret** so it is not listed on your public Calendly page. Paste its link into **Admin > Settings > Calendly link**. The link is only shown after payment: it is not in any public page, and the public database key cannot read it.

Until a link is added, paying customers see the same request form instead. It checks the payment with Stripe before saving, and those requests appear in **Leads** as "Paid session".

## 4. Environment variables

`.env.local` is already filled in for local work. For hosting, add the same names (see `.env.example`):

| Name | Value |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | `https://anokaadvisors.com` |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Supabase publishable key |
| `SUPABASE_SECRET_KEY` | Supabase secret key (server only) |
| `ADMIN_EMAIL` | `info@anokaadvisors.com` |
| `ADMIN_PASSWORD` | Server-only password for that account (already in `.env.local`) |
| `STRIPE_SECRET_KEY` | Stripe secret key |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret |
| `PEXELS_API_KEY` | Only for re-downloading photos |
| `BUSINESS_TIME_ZONE` | Optional, defaults to `America/Chicago` (admin dates) |
| `GOOGLE_SITE_VERIFICATION` | Optional, Search Console token |

## 5. Run and deploy

```bash
npm install
npm run dev      # http://localhost:3000
npm run build && npm start
```

Deploy on Vercel by importing the repository and adding the environment variables, then add `anokaadvisors.com` and `www.anokaadvisors.com` under **Domains**, with `www` redirecting to the main domain. Any Node.js 20.9+ host also works.

## Photos

Photos are listed in `scripts/image-list.mjs` and downloaded, resized and compressed to WebP by:

```bash
node --env-file=.env.local scripts/fetch-images.mjs              # fetch anything missing
node --env-file=.env.local scripts/fetch-images.mjs --only=key   # replace one photo
```

To pick a specific Pexels photo, add `id: <photo id>` to its entry. The script writes `src/content/images.json`, which holds alt text, blur placeholders and photographer credits; the `/credits` page is built from it.

## SEO checklist after launch

- Verify the domain in Google Search Console and Bing Webmaster Tools, then submit `https://anokaadvisors.com/sitemap.xml`.
- Create a Google Business Profile as a service-area business.
- Add a founder bio with a headshot and credentials to the About page.
- Have an attorney review the legal pages, especially governing law in the Terms.

## SEO built in

- **On-page:** unique titles (30 to 60 characters) and meta descriptions (120 to 160), one H1 per page, clean heading order, canonical URLs, Open Graph and Twitter cards with a branded preview image.
- **Technical:** every public page is prerendered with its full text in the HTML (readable by crawlers and AI tools that do not run JavaScript); unknown service and article URLs return a real 404 from `src/proxy.ts`; `sitemap.xml` with last-modified dates and images; `robots.txt` blocking admin, API and checkout; `llms.txt`; security headers; descriptive image file names and alt text.
- **Structured data (JSON-LD):** Organization and WebSite (site-wide), WebPage, AboutPage, ContactPage and CollectionPage per page, BreadcrumbList, Service with a price range from live packages, OfferCatalog on Pricing, ItemList of services, Blog and BlogPosting for articles, and FAQPage. Google retired FAQ rich results in May 2026, but FAQ markup still helps AI search tools cite the site.
- **Content and internal linking:** six in-depth guides in the Insights hub (two per practice area), each linking to its service, related guides, pricing and booking. Service pages link to their guides, the home page links to services and guides in the body copy, and the footer links every guide.
- **Measured on a production build (mobile):** Lighthouse 100 for SEO, Accessibility and Best Practices on the home, service and article pages; LCP 1.6 s and CLS 0 under 4x CPU and slow 4G throttling.

### Adding an article

1. Create `src/content/insights/<slug>.tsx` following an existing article (body, key takeaways, table of contents, FAQs).
2. Add the slug to `INSIGHT_SLUGS` in `src/content/slugs.ts` and the article to the list in `src/content/insights/index.ts`.
3. Add its photo to `scripts/image-list.mjs`, run `scripts/fetch-images.mjs`, then `scripts/seo-image-names.mjs`.

The sitemap, footer, Insights hub, service page and `llms.txt` (edit by hand) pick it up from there.

## Project map

```
src/app/(site)/          public pages
src/app/admin/           admin area and its server actions
src/app/api/stripe/      Stripe webhook
src/components/site/     sections, carousel, hero slider, header, footer
src/content/             service copy, Insights articles, URL slugs and the photo manifest
src/lib/                 data access, Supabase clients, checkout, SEO and schema helpers
scripts/                 Pexels photo downloader and image renaming
supabase/migrations/     database schema and starter packages
```
