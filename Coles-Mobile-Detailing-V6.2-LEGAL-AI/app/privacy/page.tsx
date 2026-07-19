import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage } from "@/components/legal-page";
import {
  BUSINESS_EMAIL,
  BUSINESS_NAME,
  BUSINESS_PHONE_DISPLAY,
  BUSINESS_REGION,
  LEGAL_BUSINESS_NAME,
  POLICY_EFFECTIVE_DATE,
} from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `How ${BUSINESS_NAME} collects, uses, protects, and shares information submitted through its website, quote forms, and AI assistant.`,
  alternates: { canonical: "/privacy" },
};

const sections = [
  {
    title: "Who this policy covers",
    paragraphs: [
      <>
        This Privacy Policy applies to the website, quote-request forms, website AI assistant, lead-management tools, and related communications operated by <strong>{LEGAL_BUSINESS_NAME}</strong>, doing business as {BUSINESS_NAME}. It applies to visitors and customers in {BUSINESS_REGION} and elsewhere who use these services.
      </>,
      "This policy does not cover third-party websites or services that we do not control, even when this website links to them.",
    ],
  },
  {
    title: "Information we collect",
    paragraphs: ["We collect information you choose to provide and limited technical information needed to operate and protect the website."],
    bullets: [
      "Contact information, such as your name, phone number, email address, city, and preferred contact details.",
      "Service information, including vehicle year, make, model, size, condition, requested service, preferred date, photos you later choose to send, and other notes.",
      "AI-assistant content, including messages, answers, and the conversation transcript when a lead is submitted or a human follow-up is requested.",
      "Lead-source information, such as referral source, landing page, referrer, UTM parameters, and Google Ads click identifiers when present.",
      "Basic technical and security information, such as IP address, browser information, timestamps, and submission activity used to detect abuse and troubleshoot errors.",
    ],
  },
  {
    title: "How we use information",
    bullets: [
      "To answer questions, prepare nonbinding estimates, review vehicle condition, and respond to quote or appointment requests.",
      "To create and manage customer, lead, and job records in our private business-management system.",
      "To contact you about the specific service request you submitted, including by phone, email, or text when you authorize that contact.",
      "To measure advertising and website performance, identify which inquiries came from ads or referrals, and improve the customer experience.",
      "To secure the website, prevent spam or misuse, maintain records, comply with legal obligations, and resolve disputes.",
    ],
  },
  {
    title: "AI assistant and automated processing",
    paragraphs: [
      <>
        The website includes an AI-assisted concierge. It is not Cole and is clearly identified as an automated assistant. It can answer routine questions, collect details, and provide server-calculated starting estimates. It cannot confirm appointments, guarantee results, or approve final pricing. Read the full <Link href="/ai-disclosure">AI Assistant Disclosure</Link>.
      </>,
      "Messages sent through the assistant may be processed by an AI service provider to generate a response. We instruct the assistant not to request sensitive financial, medical, government-identification, or payment-card information. Please do not submit that information through chat or quote forms.",
    ],
  },
  {
    title: "How information is shared",
    paragraphs: [
      "We do not sell personal information. We may share information only as reasonably necessary to operate the business, provide the requested service, protect legal rights, or comply with law.",
    ],
    bullets: [
      "Service providers that host the website, store lead records, process AI responses, deliver operational notifications, provide analytics, or support business communications.",
      "Professional advisers, insurers, payment providers, or authorities when reasonably necessary for accounting, legal compliance, safety, fraud prevention, or dispute resolution.",
      "A successor or purchaser if the business is reorganized, sold, or transferred, subject to applicable law and appropriate confidentiality protections.",
    ],
  },
  {
    title: "Mobile information and SMS consent",
    paragraphs: [
      <strong>Mobile numbers, text-message consent, and SMS opt-in data are not sold, rented, or shared with third parties or affiliates for their own marketing or promotional purposes.</strong>,
      "Phone numbers may be shared with service providers only when needed to deliver the communications or services you requested, maintain records, prevent abuse, or comply with law. Message frequency varies. Message and data rates may apply.",
      <>
        The current automated Twilio campaign is limited to internal operational alerts sent to the owner or authorized staff who separately opt in. Website visitors are not enrolled in that internal alert campaign. See <Link href="/sms-alerts">SMS Alerts & Consent</Link>.
      </>,
    ],
  },
  {
    title: "Cookies, local storage, and analytics",
    paragraphs: [
      "The website may use browser storage and similar technologies to preserve chatbot progress, remember lead attribution, prevent duplicate submissions, and understand website performance. These tools may store campaign identifiers, landing-page information, and limited interaction data.",
      "You can clear browser storage through your browser settings. Blocking these technologies may affect attribution, chatbot continuity, or certain site features.",
    ],
  },
  {
    title: "Retention and deletion",
    paragraphs: [
      "We retain information only as long as reasonably necessary for the purposes described in this policy, including providing services, maintaining customer and tax records, resolving disputes, measuring advertising, preventing fraud, and meeting legal obligations.",
      `To request access, correction, or deletion of information associated with you, email ${BUSINESS_EMAIL}. We may need to verify your identity and may retain information when required by law or reasonably necessary to protect legal rights.`,
    ],
  },
  {
    title: "Security and incident response",
    paragraphs: [
      "We use reasonable administrative, technical, and organizational safeguards designed to protect information, including restricted access, server-side secret storage, encrypted transport, private business accounts, spam controls, and vendor security settings. No internet system can be guaranteed completely secure.",
      "If a security incident occurs, we will investigate and provide notifications when required by applicable law. Do not send Social Security numbers, driver's-license numbers, financial-account credentials, or payment-card data through the website assistant or quote form.",
    ],
  },
  {
    title: "Children and sensitive information",
    paragraphs: [
      "This website is intended for adults arranging vehicle-detailing services and is not directed to children under 13. We do not knowingly collect personal information from children under 13 through the website.",
      "Do not submit sensitive personal information, including government identification numbers, financial credentials, medical information, or information about another person without permission.",
    ],
  },
  {
    title: "Your choices",
    bullets: [
      "You may choose not to use the AI assistant and contact Cole directly by phone, text, or email.",
      "You may decline optional communications and still submit a service request through available non-SMS methods.",
      "You may reply STOP to applicable automated SMS messages to opt out and HELP for assistance.",
      "You may request correction or deletion by contacting us, subject to legal and recordkeeping exceptions.",
    ],
  },
  {
    title: "Changes and contact",
    paragraphs: [
      `We may update this policy as the website, vendors, or legal requirements change. The effective date above identifies the current version. Material changes will be posted on this page.`,
      <>
        Questions or privacy requests may be sent to <a href={`mailto:${BUSINESS_EMAIL}`}>{BUSINESS_EMAIL}</a> or by calling <a href={`tel:+18126295544`}>{BUSINESS_PHONE_DISPLAY}</a>.
      </>,
    ],
  },
];

export default function PrivacyPage() {
  return (
    <LegalPage
      eyebrow="PRIVACY & DATA"
      title="Privacy Policy"
      effectiveDate={POLICY_EFFECTIVE_DATE}
      summary={<>A plain-language explanation of what information we collect, why we use it, how the AI assistant works, and the choices available to you.</>}
      sections={sections}
    />
  );
}
