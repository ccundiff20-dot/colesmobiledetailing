import type { Metadata } from "next";
import { BookingLeadForm } from "@/components/booking-lead-form";
import { InnerFooter, InnerNav, PageHero } from "@/components/inner-page";
import { stockImages } from "@/lib/stock-images";

export const metadata: Metadata = {
  title: "Book a Detail",
  description: "Request a mobile detailing appointment with Cole's Mobile Detailing in Evansville, Newburgh, and Southern Indiana.",
  alternates: { canonical: "/book" },
  openGraph: {
    title: "Book a Detail",
    description: "Request a mobile detailing appointment with Cole's Mobile Detailing in Evansville, Newburgh, and Southern Indiana.",
    url: "/book",
  },
};

export default function BookPage() {
  return (
    <main className="inner-page">
      <InnerNav />
      <PageHero
        eyebrow="REQUEST AN APPOINTMENT"
        title="Tell us what the vehicle needs."
        copy="Send the details once. Your request is saved directly into Cole's private lead dashboard for a faster, more organized follow-up."
        image={stockImages.luxuryInterior}
        imageAlt="Premium vehicle interior with illuminated controls"
        imagePosition="center 62%"
      />

      <section className="book-page cmd-booking-layout">
        <div className="cmd-booking-intro">
          <p className="inner-kicker">DIRECT BOOKING</p>
          <h2>Built for a better response.</h2>
          <p>
            Share the vehicle, service, condition, city, and preferred date. Cole can review the entire request from one place instead of piecing details together across messages.
          </p>
          <div className="cmd-booking-benefits">
            <span><b>01</b> Request saved instantly</span>
            <span><b>02</b> Google Ads source tracked</span>
            <span><b>03</b> Follow-up stays organized</span>
          </div>
          <a className="cmd-text-backup" href="sms:+18126295544?body=Hi%20Cole%2C%20I%27d%20like%20to%20request%20a%20detail.%0A%0AVehicle%3A%20%0AService%3A%20%0ACity%3A%20%0APreferred%20date%3A%20%0ACondition%2Fnotes%3A%20">
            Prefer to text instead? <span>Open a message →</span>
          </a>
        </div>
        <BookingLeadForm />
      </section>

      <section className="booking-policies">
        <article><h2>24-hour notice</h2><p>Appointments submitted without at least 24 hours of notice are not guaranteed.</p></article>
        <article><h2>Condition-based pricing</h2><p>Listed prices are starting points. Final pricing depends on vehicle size and condition.</p></article>
        <article><h2>Photos after submission</h2><p>Cole may request two to four current photos by text before confirming the final quote.</p></article>
      </section>
      <InnerFooter />
    </main>
  );
}
