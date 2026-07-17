import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://colesmobiledetail.com"),
  title: { default: "Cole's Mobile Detailing | Luxury Mobile Detailing Evansville", template: "%s | Cole's Mobile Detailing" },
  description: "Premium mobile detailing, paint correction, ceramic coatings, RV and marine detailing in Newburgh, Evansville and surrounding Southern Indiana areas.",
  keywords: ["mobile detailing Evansville", "ceramic coating Evansville", "paint correction Newburgh Indiana", "RV detailing Southern Indiana", "boat detailing Evansville"],
  alternates: { canonical: "/" },
  openGraph: {
    title: "Cole's Mobile Detailing",
    description: "Luxury-level automotive detailing delivered to your driveway.",
    url: "https://colesmobiledetail.com",
    siteName: "Cole's Mobile Detailing",
    images: [{ url: "/images/zi6 corvette.jpg", width: 1500, height: 1125, alt: "Detailed black Corvette" }],
    locale: "en_US",
    type: "website"
  },
  robots: { index: true, follow: true }
};

const schema = {
  "@context": "https://schema.org",
  "@type": "AutoDetailing",
  name: "Cole's Mobile Detailing",
  url: "https://colesmobiledetail.com",
  telephone: "+1-812-629-5544",
  email: "ccundiff20@gmail.com",
  areaServed: ["Newburgh, Indiana", "Evansville, Indiana", "Warrick County, Indiana", "Southern Indiana"],
  priceRange: "$$",
  aggregateRating: { "@type": "AggregateRating", ratingValue: "5.0", reviewCount: "80" },
  openingHoursSpecification: [{ "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday","Tuesday","Wednesday","Thursday","Friday"], opens: "09:00", closes: "17:00" }]
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} /></body></html>;
}
