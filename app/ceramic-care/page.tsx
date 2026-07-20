import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { InnerFooter, InnerNav, PageHero } from "@/components/inner-page";
import { stockImages } from "@/lib/stock-images";

export const metadata: Metadata = {
  title: "Ceramic Coating Care & Maintenance",
  description:
    "Ceramic coating care instructions and professional maintenance wash pricing from Cole's Mobile Detailing in Evansville and Newburgh, Indiana.",
  alternates: { canonical: "/ceramic-care" },
  openGraph: {
    title: "Ceramic Coating Care & Maintenance",
    description:
      "Protect your ceramic coating with the right wash routine, products, and professional maintenance services.",
    url: "/ceramic-care",
  },
};

const careCards = [
  {
    number: "01",
    title: "Keep it dry first",
    copy: "Keep the vehicle away from rain, sprinklers, and standing water for the first 12 hours. Wait 7 days before the first full wash whenever possible.",
  },
  {
    number: "02",
    title: "Wash it safely",
    copy: "Hand wash every 2–4 weeks with a pH-neutral automotive shampoo, a clean microfiber mitt, and dedicated drying towels.",
  },
  {
    number: "03",
    title: "Remove contamination",
    copy: "Bird droppings, bugs, tree sap, road film, and hard-water spots should be removed quickly instead of being allowed to bake into the finish.",
  },
  {
    number: "04",
    title: "Skip harsh methods",
    copy: "Avoid brush car washes, abrasive polishes, clay bars, household soap, strong degreasers, and dirty towels unless the service is being performed professionally.",
  },
];

const maintenancePackages = [
  {
    number: "01",
    label: "ROUTINE COATING CARE",
    title: "Ceramic Maintenance Wash",
    interval: "Recommended every 4–8 weeks",
    prices: [
      ["Sedan / Coupe", "$99"],
      ["SUV / Truck", "$119"],
      ["3-Row SUV / Van", "$139"],
    ],
    items: [
      "pH-neutral foam and hand wash",
      "Wheel faces, barrels, tires, and wheel wells",
      "Light bug removal and door-jamb wipe-down",
      "Filtered-air and microfiber drying",
      "Exterior glass and tire finish",
      "Coating performance inspection",
    ],
  },
  {
    number: "02",
    label: "INSIDE + OUT",
    title: "Maintenance Detail",
    interval: "For vehicles already kept in good condition",
    prices: [
      ["Sedan / Coupe", "$169"],
      ["SUV / Truck", "$199"],
      ["3-Row SUV / Van", "$229"],
    ],
    items: [
      "Everything in the Ceramic Maintenance Wash",
      "Light interior vacuum and compressed-air blowout",
      "Dash, console, panels, and cupholders wiped down",
      "Floor mats and interior glass cleaned",
      "Light leather or vinyl conditioning as needed",
      "Not intended for stains, heavy pet hair, or deep restoration",
    ],
  },
  {
    number: "03",
    label: "PERFORMANCE RESTORATION",
    title: "6-Month Coating Reset",
    interval: "Recommended midway through the coating term",
    prices: [
      ["Sedan / Coupe", "$179"],
      ["SUV / Truck", "$209"],
      ["3-Row SUV / Van", "$239"],
    ],
    items: [
      "Thorough coating-safe wash and wheel service",
      "Chemical decontamination when needed",
      "Mineral and water-spot assessment",
      "Coating-safe hydrophobic booster applied",
      "Trim, tire, glass, and final-detail finishing",
      "Inspection and care recommendations for the remaining term",
    ],
  },
];

const faqs = [
  {
    question: "Can I use an automatic car wash?",
    answer:
      "Touchless washes are better than brush washes in an emergency, but a proper hand wash is the safest choice. Repeated brush washes can create swirls and shorten the coating's useful life.",
  },
  {
    question: "What soap should I use?",
    answer:
      "Use a pH-neutral automotive shampoo made for coated vehicles. Avoid household dish soap, strong degreasers, and wash-and-wax products that can mask the coating's natural water behavior.",
  },
  {
    question: "Why did the water beading slow down?",
    answer:
      "Road film, minerals, iron, and other contamination can temporarily clog the surface. A professional maintenance or reset wash can often restore the coating's water behavior without polishing it off.",
  },
  {
    question: "Does a coating prevent scratches?",
    answer:
      "No coating makes paint scratch-proof. It helps with chemical resistance, gloss, water behavior, and easier cleaning, but safe wash technique is still essential.",
  },
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: { "@type": "Answer", text: faq.answer },
  })),
};

export default function CeramicCarePage() {
  return (
    <main className="inner-page ceramic-care-page">
      <InnerNav />
      <PageHero
        eyebrow="OWNER CARE GUIDE"
        title="Keep the coating performing like it should."
        copy="A ceramic coating is low-maintenance—not no-maintenance. Follow this care plan to preserve gloss, water behavior, and protection for the full term."
        image={stockImages.foamWash}
        imageAlt="Coated black vehicle receiving a careful foam wash"
        imagePosition="center 52%"
      />

      <section className="care-intro">
        <div>
          <p>THE FIRST WEEK</p>
          <h2>Let the protection settle before putting it to work.</h2>
        </div>
        <div className="care-intro-copy">
          <strong>First 12 hours</strong>
          <p>Keep the finish dry and away from sprinklers, rain, or standing water whenever possible.</p>
          <strong>First 7 days</strong>
          <p>Avoid a full wash and do not apply waxes, sealants, toppers, polishes, or aggressive chemicals.</p>
          <small>
            A coating can provide up to its advertised term only when the paint is maintained correctly. Climate, mileage,
            storage, wash habits, and contamination all affect real-world performance.
          </small>
        </div>
      </section>

      <section className="care-card-grid" aria-label="Ceramic coating care steps">
        {careCards.map((card) => (
          <article key={card.number}>
            <span>{card.number}</span>
            <h2>{card.title}</h2>
            <p>{card.copy}</p>
          </article>
        ))}
      </section>

      <section className="care-image-break">
        <Image
          src={stockImages.maintenanceRinse}
          alt="A coated vehicle receiving a careful wheel and body rinse"
          fill
          sizes="100vw"
        />
        <div />
        <p>SAFE WASHING PROTECTS THE FINISH BENEATH THE GLOSS.</p>
      </section>

      <section className="maintenance-menu" id="maintenance-services">
        <header>
          <p>PROFESSIONAL AFTERCARE</p>
          <h2>Maintenance services built for coated vehicles.</h2>
          <span>
            These packages are for vehicles that are already coated or have recently received a full detail. Excessive buildup,
            stains, pet hair, or neglected paint may require a standard detail before maintenance pricing applies.
          </span>
        </header>

        <div className="maintenance-package-list">
          {maintenancePackages.map((service) => (
            <article key={service.number}>
              <div className="maintenance-package-title">
                <span>{service.number}</span>
                <div>
                  <p>{service.label}</p>
                  <h3>{service.title}</h3>
                  <small>{service.interval}</small>
                </div>
              </div>

              <ul>
                {service.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>

              <div className="maintenance-prices">
                {service.prices.map(([vehicle, price]) => (
                  <div key={vehicle}>
                    <span>{vehicle}</span>
                    <strong>{price}</strong>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>

        <div className="maintenance-fine-print">
          <p>
            Pricing is based on vehicle size and routine condition. Travel, severe contamination, water-spot removal, pet hair,
            staining, or additional labor may change the final quote. Appointments require at least 24 hours&apos; notice and are not
            guaranteed until confirmed.
          </p>
          <a href="sms:+18126295544?body=Hi%20Cole%2C%20I%27d%20like%20to%20schedule%20a%20ceramic%20maintenance%20service.">
            Text to schedule maintenance
          </a>
        </div>
      </section>

      <section className="care-avoid-section">
        <div className="care-avoid-copy">
          <p>QUICK REFERENCE</p>
          <h2>What to use—and what to avoid.</h2>
        </div>
        <div className="care-do-dont">
          <article>
            <span>DO</span>
            <ul>
              <li>Use pH-neutral automotive shampoo</li>
              <li>Use clean microfiber wash and drying towels</li>
              <li>Wash from the top down and rinse thoroughly</li>
              <li>Dry the vehicle instead of letting water evaporate</li>
              <li>Contact Cole when beading or gloss changes noticeably</li>
            </ul>
          </article>
          <article>
            <span>AVOID</span>
            <ul>
              <li>Brush or tunnel washes</li>
              <li>Dish soap and household cleaners</li>
              <li>Clay bars, compounds, or polish over the coating</li>
              <li>Washing hot paint in direct sunlight</li>
              <li>Allowing bugs, bird droppings, sap, or minerals to sit</li>
            </ul>
          </article>
        </div>
      </section>

      <section className="care-faq">
        <header>
          <p>COMMON QUESTIONS</p>
          <h2>Simple answers for everyday coating care.</h2>
        </header>
        <div>
          {faqs.map((faq, index) => (
            <article key={faq.question}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <div>
                <h3>{faq.question}</h3>
                <p>{faq.answer}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="page-cta care-page-cta">
        <p>PROTECT THE INVESTMENT</p>
        <h2>Keep it clean without stripping away the protection.</h2>
        <div>
          <a href="sms:+18126295544?body=Hi%20Cole%2C%20I%27d%20like%20to%20book%20a%20ceramic%20maintenance%20wash.">
            Text Cole
          </a>
          <Link href="/book">Request an appointment</Link>
        </div>
      </section>

      <InnerFooter />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
    </main>
  );
}
