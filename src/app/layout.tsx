import type { Metadata, Viewport } from "next";
import { Newsreader, Public_Sans } from "next/font/google";
import { site } from "@/lib/site";
import "./globals.css";

const newsreader = Newsreader({
  subsets: ["latin"],
  axes: ["opsz"],
  variable: "--font-newsreader",
  display: "swap",
});

const publicSans = Public_Sans({
  subsets: ["latin"],
  variable: "--font-public-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "Healthcare, Telehealth and Pharmacy Operations Consulting | Anoka Advisors",
    template: `%s | ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  authors: [{ name: site.name, url: site.url }],
  creator: site.name,
  publisher: site.name,
  category: "Business consulting",
  openGraph: {
    type: "website",
    siteName: site.name,
    locale: "en_US",
    url: "/",
  },
  twitter: { card: "summary_large_image" },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
  ...(process.env.GOOGLE_SITE_VERIFICATION
    ? { verification: { google: process.env.GOOGLE_SITE_VERIFICATION } }
    : {}),
};

export const viewport: Viewport = {
  themeColor: "#0a1310",
  colorScheme: "dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en-US" className={`${newsreader.variable} ${publicSans.variable}`}>
      <body className="min-h-dvh antialiased">{children}</body>
    </html>
  );
}
