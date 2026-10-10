import type { Metadata } from "next";
import { LegalPage, type LegalSection } from "@/components/site/legal-page";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Accessibility Statement",
  description:
    "Our commitment to an accessible website: the WCAG 2.2 AA standard we follow, the measures in place, known limitations and how to get help or give feedback.",
  path: "/accessibility",
});

const sections: LegalSection[] = [
  {
    id: "commitment",
    title: "Our commitment",
    body: (
      <p>
        We want everyone to be able to learn about our services, contact us and book a call. We aim to meet the Web
        Content Accessibility Guidelines (WCAG) 2.2 at level AA.
      </p>
    ),
  },
  {
    id: "measures",
    title: "What we do",
    body: (
      <ul>
        <li>Semantic headings and landmarks so screen readers can navigate each page</li>
        <li>Full keyboard access with a visible focus indicator</li>
        <li>Text and controls with strong color contrast against the dark background</li>
        <li>Descriptive text alternatives for meaningful images</li>
        <li>Animations and automatic sliders that stop when your device is set to reduce motion</li>
        <li>Carousels with pause on hover and focus, plus previous, next and slide controls</li>
        <li>Form fields with labels, hints and clear error messages</li>
      </ul>
    ),
  },
  {
    id: "third-party",
    title: "Third-party content",
    body: (
      <p>
        The booking calendar and checkout are provided by third parties. We choose providers that support accessibility,
        but we do not control their interfaces.
      </p>
    ),
  },
  {
    id: "limitations",
    title: "Known limitations",
    body: <p>Some photographs are decorative and intentionally skipped by screen readers. If anything on the site is hard to use, please tell us.</p>,
  },
  {
    id: "alternatives",
    title: "Other ways to reach us",
    body: (
      <p>
        If you cannot use the booking calendar or forms, email info@anokaadvisors.com and we will schedule a call, share
        information in another format or help in whatever way works for you.
      </p>
    ),
  },
  {
    id: "feedback",
    title: "Feedback",
    body: (
      <p>
        Tell us about any barrier you meet, including the page address and what happened. We review every report and
        use it to improve the site.
      </p>
    ),
  },
  {
    id: "review",
    title: "Ongoing review",
    body: <p>We check accessibility when we add new pages or features, and we review this statement at least once a year.</p>,
  },
];

export default function AccessibilityPage() {
  return (
    <LegalPage
      description={String(metadata.description ?? "")}
      image="lg-accessibility"
      title="Accessibility statement"
      path="/accessibility"
      intro={<p>We are committed to making this website usable by as many people as possible.</p>}
      sections={sections}
    />
  );
}
