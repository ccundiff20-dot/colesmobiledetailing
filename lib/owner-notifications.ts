type NotificationLead = {
  name: string;
  phone: string;
  email: string;
  vehicle: string;
  service: string;
  city: string;
  estimateLow?: number;
  estimateHigh?: number;
  question?: string;
  source?: string;
};

function compact(value: string, max = 220) {
  return value.trim().replace(/\s+/g, " ").slice(0, max);
}

function enabled(value: string | undefined) {
  return ["1", "true", "yes", "on"].includes((value || "").trim().toLowerCase());
}

export async function sendOwnerSms(lead: NotificationLead, kind: "lead" | "handoff" = "lead") {
  const accountSid = process.env.TWILIO_ACCOUNT_SID?.trim();
  const authToken = process.env.TWILIO_AUTH_TOKEN?.trim();
  const from = process.env.TWILIO_FROM_NUMBER?.trim();
  const messagingServiceSid = process.env.TWILIO_MESSAGING_SERVICE_SID?.trim();
  const to = process.env.OWNER_NOTIFICATION_PHONE?.trim();
  const ownerOptedIn = enabled(process.env.OWNER_SMS_OPTED_IN);

  if (!ownerOptedIn) return { sent: false, configured: false, reason: "owner-not-opted-in" };
  if (!accountSid || !authToken || !to || (!from && !messagingServiceSid)) {
    return { sent: false, configured: false, reason: "missing-configuration" };
  }

  const estimate = lead.estimateLow && lead.estimateHigh
    ? `Estimate: $${lead.estimateLow}–$${lead.estimateHigh}`
    : "Estimate: manual review";
  const contact = [lead.phone, lead.email].filter(Boolean).join(" | ");
  const title = kind === "handoff" ? "AI handoff needs Cole" : "New website lead";
  const dashboardUrl = process.env.DF_OWNER_DASHBOARD_URL?.trim() || "https://digitalforgeplatform.netlify.app/dashboard/leads";

  const body = [
    `Cole's Mobile Detailing: ${title}`,
    `${compact(lead.name || "Unknown")} — ${compact(lead.vehicle || "Vehicle not provided")}`,
    `Service: ${compact(lead.service || "General inquiry")}`,
    lead.city ? `City: ${compact(lead.city)}` : "",
    contact ? `Contact: ${compact(contact)}` : "",
    estimate,
    lead.question ? `Note: ${compact(lead.question, 260)}` : "",
    lead.source ? `Source: ${compact(lead.source)}` : "",
    dashboardUrl,
    "Reply STOP to unsubscribe. Reply HELP for help.",
  ].filter(Boolean).join("\n").slice(0, 1500);

  const params = new URLSearchParams({ To: to, Body: body });
  if (messagingServiceSid) params.set("MessagingServiceSid", messagingServiceSid);
  else if (from) params.set("From", from);

  const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`${accountSid}:${authToken}`).toString("base64")}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params,
    signal: AbortSignal.timeout(10_000),
  });

  if (!response.ok) {
    const message = await response.text().catch(() => "Twilio notification failed");
    throw new Error(message.slice(0, 300));
  }

  return { sent: true, configured: true };
}
