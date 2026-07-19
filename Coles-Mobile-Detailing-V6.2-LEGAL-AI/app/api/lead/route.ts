import { NextResponse } from "next/server";
import { sendOwnerSms } from "@/lib/owner-notifications";
import { deliverLeadToPlatform } from "@/lib/platform-lead-delivery";
import { containsSensitiveData } from "@/lib/input-safety";

export const runtime = "nodejs";

const recent = new Map<string, number[]>();

function text(value: unknown, max: number) {
  return String(value || "").trim().slice(0, max);
}

function limited(key: string) {
  const now = Date.now();
  const entries = (recent.get(key) || []).filter((stamp) => now - stamp < 60_000);
  entries.push(now);
  recent.set(key, entries);
  return entries.length > 6;
}


export async function POST(request: Request) {
  const contentType = request.headers.get("content-type") || "";
  if (!contentType.includes("application/json")) {
    return NextResponse.json({ error: "JSON requests are required." }, { status: 415 });
  }

  const forwardedFor = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (limited(`lead:${forwardedFor}`)) {
    return NextResponse.json({ error: "Please wait before submitting another request." }, { status: 429 });
  }

  const body = await request.json().catch(() => null) as Record<string, unknown> | null;
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  if (text(body.website, 200)) return NextResponse.json({ ok: true });

  const name = text(body.name, 100);
  const phone = text(body.phone, 40);
  const email = text(body.email, 140).toLowerCase();
  const vehicle = text(body.vehicle, 180);
  const service = text(body.service, 140);
  const city = text(body.city, 180);
  const notes = text(body.notes, 2000);
  const acceptedTerms = body.acceptedTerms === true;
  const contactAuthorized = body.contactAuthorized === true;

  if (!acceptedTerms || !contactAuthorized) {
    return NextResponse.json({ error: "Consent and acceptance are required to submit this request." }, { status: 400 });
  }
  if (!name || (!phone && !email) || !vehicle || !service || !city) {
    return NextResponse.json({ error: "Complete the required fields and add a phone number or email." }, { status: 400 });
  }
  if (containsSensitiveData([name, email, vehicle, service, city, notes].join(" "))) {
    return NextResponse.json({ error: "Please remove payment-card, Social Security, banking, password, or other sensitive information before submitting." }, { status: 400 });
  }

  const source = text(body.source, 80) || "Website";
  const consentTimestamp = text(body.consentTimestamp, 40) || new Date().toISOString();
  const lead = {
    submissionId: text(body.submissionId, 180),
    name,
    phone,
    email,
    vehicle,
    request: text(body.request, 300) || `${vehicle} — ${service}`,
    service,
    city,
    preferredDate: text(body.preferredDate, 20),
    source,
    notes: [
      notes,
      "Contact authorization: accepted for this service request.",
      `Privacy/Terms accepted: ${consentTimestamp}.`,
      "Not enrolled in recurring marketing SMS through this form.",
    ].filter(Boolean).join("\n").slice(0, 2600),
    attribution: body.attribution,
  };

  try {
    const result = await deliverLeadToPlatform(lead, forwardedFor);
    let notificationSent = false;
    try {
      const notification = await sendOwnerSms({
        name,
        phone,
        email,
        vehicle,
        service,
        city,
        question: notes,
        source,
      });
      notificationSent = notification.sent;
    } catch {
      notificationSent = false;
    }
    return NextResponse.json({ ...result, notificationSent });
  } catch (caught) {
    const timedOut = caught instanceof Error && caught.name === "AbortError";
    return NextResponse.json({
      error: timedOut ? "The request timed out. Please try again." : caught instanceof Error ? caught.message : "The request could not be sent. Please text or call Cole.",
    }, { status: 502 });
  }
}
