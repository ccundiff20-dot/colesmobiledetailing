import Link from "next/link";
import { InnerFooter, InnerNav } from "@/components/inner-page";

type LegalSection = {
  title: string;
  paragraphs?: React.ReactNode[];
  bullets?: React.ReactNode[];
};

export function LegalPage({
  eyebrow,
  title,
  summary,
  effectiveDate,
  sections,
}: {
  eyebrow: string;
  title: string;
  summary: React.ReactNode;
  effectiveDate: string;
  sections: LegalSection[];
}) {
  return (
    <main className="inner-page legal-page">
      <InnerNav />
      <section className="legal-hero">
        <p>{eyebrow}</p>
        <h1>{title}</h1>
        <div className="legal-summary">{summary}</div>
        <span>Effective: {effectiveDate}</span>
      </section>

      <section className="legal-layout">
        <aside className="legal-index" aria-label={`${title} sections`}>
          <strong>On this page</strong>
          {sections.map((section, index) => (
            <a href={`#section-${index + 1}`} key={section.title}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              {section.title}
            </a>
          ))}
        </aside>

        <article className="legal-content">
          {sections.map((section, index) => (
            <section id={`section-${index + 1}`} key={section.title}>
              <div className="legal-section-number">{String(index + 1).padStart(2, "0")}</div>
              <div>
                <h2>{section.title}</h2>
                {section.paragraphs?.map((paragraph, paragraphIndex) => (
                  <p key={paragraphIndex}>{paragraph}</p>
                ))}
                {section.bullets && (
                  <ul>
                    {section.bullets.map((bullet, bulletIndex) => <li key={bulletIndex}>{bullet}</li>)}
                  </ul>
                )}
              </div>
            </section>
          ))}

          <div className="legal-review-note">
            <strong>Important</strong>
            <p>
              These pages describe the website and business practices currently implemented. They are not a substitute for advice from a licensed attorney. Business practices, vendors, pricing, and laws can change, so these terms should be reviewed periodically.
            </p>
            <div>
              <Link href="/privacy">Privacy</Link>
              <Link href="/terms">Terms</Link>
              <Link href="/ai-disclosure">AI disclosure</Link>
              <Link href="/sms-alerts">SMS alerts</Link>
            </div>
          </div>
        </article>
      </section>
      <InnerFooter />
    </main>
  );
}
