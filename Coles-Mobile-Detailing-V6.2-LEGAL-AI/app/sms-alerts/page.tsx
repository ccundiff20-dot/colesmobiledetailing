import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage } from "@/components/legal-page";
import { BUSINESS_EMAIL, BUSINESS_NAME, POLICY_EFFECTIVE_DATE } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "SMS Alerts and Consent",
  description: `Opt-in, message frequency, STOP, HELP, and privacy information for ${BUSINESS_NAME} internal lead-notification SMS alerts.`,
  alternates: { canonical: "/sms-alerts" },
};

const sections = [
  {
    title: "Current SMS program",
    paragraphs: [
      `${BUSINESS_NAME} uses an internal operational SMS alert program to notify the owner or specifically authorized staff when a customer submits a website quote form or asks the AI assistant for human follow-up.`,
      "The current program is not a marketing list and does not automatically enroll website visitors or customers as message recipients.",
    ],
  },
  {
    title: "How recipients opt in",
    paragraphs: [
      "An authorized recipient opts in by personally providing and verifying their own mobile number, entering it in the private server configuration, enabling owner-notification SMS alerts, and confirming that they want operational alerts from the business.",
      "Only the owner or authorized staff with permission to receive business lead notifications may be enrolled. The configured number can be removed at any time to stop alerts.",
    ],
  },
  {
    title: "What messages contain",
    bullets: [
      "The business name and identification of the message as a new website lead or human-handoff alert.",
      "Limited lead information such as customer name, requested service, vehicle, city, estimate status, and contact method.",
      "A reminder that the recipient can reply STOP to opt out and HELP for assistance.",
    ],
  },
  {
    title: "Frequency and carrier charges",
    paragraphs: [
      "Message frequency varies based on incoming website leads and chatbot handoffs. Periods with no leads may have no messages; busier periods may have multiple alerts.",
      "Message and data rates may apply. Delivery is subject to carrier availability, and carriers are not liable for delayed or undelivered messages.",
    ],
  },
  {
    title: "STOP and HELP",
    paragraphs: [
      "Reply STOP to unsubscribe from future automated alerts. Standard opt-out keywords may also be recognized by the messaging provider. After opt-out, no further automated alerts should be sent unless the recipient later provides new consent and re-enrolls.",
      `Reply HELP for assistance or email ${BUSINESS_EMAIL}.`,
    ],
  },
  {
    title: "Privacy and non-sharing",
    paragraphs: [
      <>
        Mobile numbers, SMS consent, and opt-in data are not sold or shared with third parties or affiliates for their own marketing or promotional purposes. Information may be processed by messaging and infrastructure providers only as needed to operate the alert program. See the <Link href="/privacy">Privacy Policy</Link> and <Link href="/terms">Terms and Conditions</Link>.
      </>,
    ],
  },
  {
    title: "Customer texting is separate",
    paragraphs: [
      "A customer who submits a quote request is not automatically enrolled in this internal alert program. Any future recurring customer SMS program must use a separate, clear, voluntary opt-in flow that can be declined without preventing submission of the primary service request.",
    ],
  },
];

export default function SmsAlertsPage() {
  return (
    <LegalPage
      eyebrow="OPERATIONAL NOTIFICATIONS"
      title="SMS Alerts & Consent"
      effectiveDate={POLICY_EFFECTIVE_DATE}
      summary={<>Public documentation of the owner-only internal lead-notification program used for A2P registration and recipient consent verification.</>}
      sections={sections}
    />
  );
}
