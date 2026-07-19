import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage } from "@/components/legal-page";
import {
  BUSINESS_EMAIL,
  BUSINESS_NAME,
  BUSINESS_PHONE_DISPLAY,
  LEGAL_BUSINESS_NAME,
  POLICY_EFFECTIVE_DATE,
} from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Terms and Conditions",
  description: `Website, quote, booking, AI assistant, and service terms for ${BUSINESS_NAME}.`,
  alternates: { canonical: "/terms" },
};

const sections = [
  {
    title: "Agreement to these terms",
    paragraphs: [
      <>
        These Terms and Conditions govern your use of the website and related online tools operated by <strong>{LEGAL_BUSINESS_NAME}</strong>, doing business as {BUSINESS_NAME}. By using the website, submitting a request, or starting the AI-assisted chat, you agree to these Terms and the <Link href="/privacy">Privacy Policy</Link>.
      </>,
      "If you do not agree, do not use the website or submit information through it. Separate written estimates, invoices, service authorizations, or agreements may include additional terms that control the specific service.",
    ],
  },
  {
    title: "Website information is not a final offer",
    paragraphs: [
      "Service descriptions, prices, time estimates, availability statements, promotions, and AI-generated responses are informational starting points. They are not a binding offer, guaranteed appointment, guaranteed result, or final price.",
      "A service is scheduled only after Cole reviews the request and confirms the scope, location, date, price, access requirements, and any applicable deposit or special conditions.",
    ],
  },
  {
    title: "AI assistant terms",
    paragraphs: [
      <>
        The website assistant is an automated AI tool, not Cole and not a human employee. It may make mistakes, misunderstand details, or provide incomplete information. Server-side pricing rules may display a starting estimate, but Cole must confirm final pricing and availability. Review the <Link href="/ai-disclosure">AI Assistant Disclosure</Link> before relying on a response.
      </>,
      "You agree not to use the assistant for emergencies, legal advice, financial advice, medical matters, safety-critical decisions, abusive content, unlawful requests, or submission of sensitive financial or identity information.",
    ],
  },
  {
    title: "Quotes, condition, and changes in scope",
    paragraphs: [
      "Quotes are based on the information and photos available at the time. Vehicle size, actual condition, pet hair, stains, odors, mold, biohazards, oxidation, paint defects, access, travel, and additional labor may change the scope or price.",
      "If the vehicle differs materially from the description, Cole may revise the quote, recommend a different service, decline unsafe work, or stop work until you approve the revised scope.",
    ],
  },
  {
    title: "Customer responsibilities",
    bullets: [
      "Provide accurate information about the vehicle, condition, location, access, hazards, aftermarket parts, prior repairs, and known defects.",
      "Remove valuables, cash, weapons, medications, fragile items, child seats, and personal property before service unless otherwise agreed.",
      "Provide lawful access to the vehicle and, when required, safe access to water, electricity, parking, and the work area.",
      "Disclose mold, bodily fluids, needles, chemicals, pests, hazardous materials, severe odors, or other conditions that could affect safety.",
      "Ensure you own the vehicle or have permission from the owner to authorize the requested service.",
    ],
  },
  {
    title: "Appointments, delays, and cancellations",
    paragraphs: [
      "Appointment requests require confirmation. Weather, unsafe conditions, equipment issues, illness, access problems, or earlier jobs may require rescheduling. We will make reasonable efforts to communicate changes.",
      "Any deposit, cancellation, rescheduling, no-show, or late-arrival policy presented in a written quote, invoice, confirmation, or service agreement applies to that appointment. If no separate policy is provided, contact Cole as soon as possible when plans change.",
    ],
  },
  {
    title: "Results and existing damage",
    paragraphs: [
      "Detailing improves appearance and cleanliness but cannot guarantee removal of every stain, odor, scratch, swirl, water spot, oxidation mark, defect, or contaminant. Some defects are permanent or require repair outside the scope of detailing.",
      "Older, damaged, repainted, modified, loose, cracked, peeling, corroded, or improperly installed materials may react unpredictably to cleaning or polishing. We may document existing condition before work and may decline work that presents an unreasonable risk.",
    ],
  },
  {
    title: "Photos, reviews, and marketing",
    paragraphs: [
      "Operational photos may be taken to document condition, work performed, or a dispute. Identifying information will not intentionally be published without permission.",
      "Marketing use of customer vehicles, testimonials, names, faces, license plates, addresses, or other identifiable information requires permission or reasonable de-identification. You may revoke future marketing permission by contacting us, but previously published lawful materials may remain in archived or printed content.",
    ],
  },
  {
    title: "Payments and disputes",
    paragraphs: [
      "Payment terms are stated in the applicable estimate, invoice, or service agreement. You agree to provide accurate billing information and promptly raise concerns so we have a reasonable opportunity to inspect and address them.",
      "Chargebacks or payment disputes should not be used to avoid payment for authorized work. Nothing in these Terms limits rights that cannot legally be waived.",
    ],
  },
  {
    title: "Acceptable website use",
    bullets: [
      "Do not submit false leads, impersonate another person, interfere with the website, probe security, scrape data, upload malware, or attempt unauthorized access.",
      "Do not use the assistant to generate abusive, threatening, discriminatory, unlawful, deceptive, or harmful content.",
      "Do not copy, resell, reverse engineer, or commercially exploit website content, design, software, branding, photos, or videos without permission.",
    ],
  },
  {
    title: "Third-party services",
    paragraphs: [
      "The website may rely on third-party hosting, CRM, analytics, AI, messaging, payment, mapping, email, and scheduling providers. Their services may experience outages, delays, policy changes, or errors outside our control.",
      "Links to third-party websites are provided for convenience and do not mean we control or endorse their privacy, security, or terms.",
    ],
  },
  {
    title: "Disclaimers and limitation of liability",
    paragraphs: [
      "To the fullest extent permitted by law, the website and online tools are provided on an “as available” basis without warranties that they will be uninterrupted, error-free, or suitable for every purpose.",
      "To the fullest extent permitted by law, neither the business nor its owner will be liable for indirect, incidental, special, exemplary, or consequential damages arising from website use, AI output, service delays, lost data, or third-party services. Any direct liability related to a paid detailing service will not exceed the amount paid for the specific service giving rise to the claim, except where a different limit is required by law or stated in a separate written agreement.",
    ],
  },
  {
    title: "Indemnity",
    paragraphs: [
      "To the extent permitted by law, you agree to be responsible for losses, claims, or expenses caused by your unlawful use of the website, false or unauthorized submissions, violation of these Terms, or infringement of another person's rights.",
    ],
  },
  {
    title: "Governing law and general terms",
    paragraphs: [
      "These Terms are governed by the laws of the State of Indiana, without regard to conflict-of-law rules. Any dispute will be brought in a court with lawful jurisdiction over the parties and subject matter unless a separate written agreement provides another process.",
      "If one provision is unenforceable, the remaining provisions remain in effect. Failure to enforce a provision is not a waiver. We may update these Terms by posting a revised version with a new effective date.",
    ],
  },
  {
    title: "Contact",
    paragraphs: [
      <>
        Questions about these Terms may be sent to <a href={`mailto:${BUSINESS_EMAIL}`}>{BUSINESS_EMAIL}</a> or by calling <a href="tel:+18126295544">{BUSINESS_PHONE_DISPLAY}</a>.
      </>,
    ],
  },
];

export default function TermsPage() {
  return (
    <LegalPage
      eyebrow="WEBSITE & SERVICE TERMS"
      title="Terms and Conditions"
      effectiveDate={POLICY_EFFECTIVE_DATE}
      summary={<>The rules for using this website, requesting a quote, interacting with the AI assistant, and arranging detailing services.</>}
      sections={sections}
    />
  );
}
