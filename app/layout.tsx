import type { Metadata } from "next";
import "./globals.css";
import { LeadAttributionCapture } from "@/components/lead-attribution";
import { ColeAssistant } from "@/components/cole-assistant";

const siteUrl = "https://colesmobiledetail.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Cole's Mobile Detailing | Mobile Detailing in Evansville & Newburgh",
    template: "%s | Cole's Mobile Detailing",
  },
  description:
    "Owner-operated mobile detailing, ceramic coatings, paint correction, RV, marine, and fleet detailing in Evansville, Newburgh, and Southern Indiana.",
  applicationName: "Cole's Mobile Detailing",
  authors: [{ name: "Cole's Mobile Detailing", url: siteUrl }],
  creator: "Cole's Mobile Detailing",
  publisher: "Cole's Mobile Detailing",
  keywords: [
    "mobile detailing Evansville",
    "mobile detailing Newburgh Indiana",
    "ceramic coating Evansville",
    "paint correction Evansville",
    "RV detailing Southern Indiana",
    "boat detailing Evansville",
    "fleet detailing Evansville",
  ],
  alternates: { canonical: "/" },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.png", type: "image/png", sizes: "512x512" },
    ],
    apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
  },
  manifest: "/manifest.webmanifest",
  openGraph: {
    title: "Cole's Mobile Detailing | Premium Mobile Detailing",
    description:
      "Real results. Owner-operated care. Mobile detailing, coatings, correction, RV, marine, and fleet service across Southern Indiana.",
    url: siteUrl,
    siteName: "Cole's Mobile Detailing",
    images: [
      {
        url: "/og-share.jpg",
        width: 1200,
        height: 630,
        alt: "Cole's Mobile Detailing — premium mobile detailing in Southern Indiana",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Cole's Mobile Detailing | Premium Mobile Detailing",
    description: "Mobile detailing, coatings, paint correction, RV, marine, and fleet care across Southern Indiana.",
    images: ["/og-share.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  category: "automotive",
};

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "AutoDetailing",
  "@id": `${siteUrl}/#business`,
  name: "Cole's Mobile Detailing",
  url: siteUrl,
  image: `${siteUrl}/og-share.jpg`,
  logo: `${siteUrl}/icon.png`,
  telephone: "+1-812-629-5544",
  email: "ccundiff20@gmail.com",
  description:
    "Owner-operated mobile detailing, paint correction, ceramic coatings, RV, marine, and fleet detailing serving Evansville, Newburgh, and surrounding Southern Indiana.",
  areaServed: [
    { "@type": "City", name: "Evansville, Indiana" },
    { "@type": "City", name: "Newburgh, Indiana" },
    { "@type": "AdministrativeArea", name: "Warrick County, Indiana" },
    { "@type": "AdministrativeArea", name: "Vanderburgh County, Indiana" },
  ],
  priceRange: "$$",
  currenciesAccepted: "USD",
  paymentAccepted: "Cash, Credit Card",
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "5.0",
    reviewCount: "80",
    bestRating: "5",
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "09:00",
      closes: "17:00",
    },
  ],
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${siteUrl}/#website`,
  url: siteUrl,
  name: "Cole's Mobile Detailing",
  publisher: { "@id": `${siteUrl}/#business` },
  inLanguage: "en-US",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <LeadAttributionCapture />
        {children}
        <ColeAssistant />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }} />
      </body>
    </html>
  );
}
