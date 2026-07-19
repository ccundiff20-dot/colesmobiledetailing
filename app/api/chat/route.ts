import { NextResponse } from "next/server";
import { estimateQuote, moneyRange, type AssistantLead } from "@/lib/cmd-pricing";
import { sendOwnerSms } from "@/lib/owner-notifications";
import { deliverLeadToPlatform } from "@/lib/platform-lead-delivery";
import { containsSensitiveData } from "@/lib/input-safety";

export const runtime = "nodejs";

const recent = new Map<string, number[]>();

type ChatMessage = { role: "user" | "assistant"; content: string };
type Intent = "quote" | "booking" | "question" | "human" | "other";
type ModelDecision = AssistantLead & {
  reply: string;
  intent: Intent;
  needsHuman: boolean;
  escalationReason: string;
};

type RawOpenAiResponse = {
  output_text?: string;
  output?: Array<{
    content?: Array<{ type?: string; text?: string }>;
  }>;
  error?: { message?: string };
};

function clean(value: unknown, max: number) {
  return String(value || "").trim().slice(0, max);
}

function limited(ip: string) {
  const now = Date.now();
  const entries = (recent.get(ip) || []).filter((stamp) => now - stamp < 60_000);
  entries.push(now);
  recent.set(ip, entries);
  return entries.length > 20;
}

function mergeLead(base: AssistantLead, next: AssistantLead): AssistantLead {
  return {
    name: next.name || base.name,
    phone: next.phone || base.phone,
    email: next.email || base.email,
    vehicle: next.vehicle || base.vehicle,
    service: next.service || base.service,
    city: next.city || base.city,
    preferredDate: next.preferredDate || base.preferredDate,
    condition: next.condition || base.condition,
    contactAuthorized: next.contactAuthorized || base.contactAuthorized,
  };
}

function hasContact(lead: AssistantLead) {
  return Boolean(lead.phone || lead.email);
}

function readyForLead(lead: AssistantLead) {
  return Boolean(lead.name && hasContact(lead) && lead.vehicle && lead.service && lead.city && lead.contactAuthorized);
}

function missingLeadFields(lead: AssistantLead) {
  return [
    !lead.service ? "service" : "",
    !lead.vehicle ? "vehicle year, make, and model" : "",
    !lead.city ? "city" : "",
    !lead.name ? "name" : "",
    !hasContact(lead) ? "phone number or email" : "",
    hasContact(lead) && !lead.contactAuthorized ? "permission to contact you" : "",
  ].filter(Boolean);
}

function transcript(messages: ChatMessage[]) {
  return messages
    .slice(-14)
    .map((message) => `${message.role === "user" ? "Customer" : "AI Assistant"}: ${message.content}`)
    .join("\n")
    .slice(0, 6000);
}

function lastUserMessage(messages: ChatMessage[]) {
  return [...messages].reverse().find((message) => message.role === "user")?.content || "";
}

function previousAssistantMessage(messages: ChatMessage[]) {
  const lastUserIndex = [...messages].map((message) => message.role).lastIndexOf("user");
  for (let index = lastUserIndex - 1; index >= 0; index -= 1) {
    if (messages[index]?.role === "assistant") return messages[index].content;
  }
  return "";
}

const supportedCities = [
  ["Evansville", /\bevansville\b/i],
  ["Newburgh", /\bnewburgh\b/i],
  ["Boonville", /\bboonville\b/i],
  ["Chandler", /\bchandler\b/i],
  ["Haubstadt", /\bhaubstadt\b/i],
  ["Fort Branch", /\bfort\s+branch\b/i],
  ["Princeton", /\bprinceton\b/i],
  ["Poseyville", /\bposeyville\b/i],
  ["Mount Vernon", /\b(?:mount|mt\.?)[\s-]+vernon\b/i],
] as const;

function extractKnownCity(value: string) {
  return supportedCities.find(([, pattern]) => pattern.test(value))?.[0] || "";
}

function removeUnverifiedDeliveryClaims(value: string) {
  return value
    .replace(/(?:thanks[—,! ]*)?(?:i(?:'ve| have)?|we(?:'ve| have)?)\s+(?:sent|submitted|saved|forwarded)\s+(?:your|the)\s+(?:request|information|details|quote)[^.!?]*[.!?]?/gi, "")
    .replace(/cole (?:has|now has|received) (?:your|the) (?:request|information|details)[^.!?]*[.!?]?/gi, "")
    .replace(/\s{2,}/g, " ")
    .trim();
}


function fallbackDecision(messages: ChatMessage[], lead: AssistantLead): ModelDecision {
  const latest = lastUserMessage(messages);
  const previousAssistant = previousAssistantMessage(messages).toLowerCase();
  const lower = latest.toLowerCase();
  const detected: AssistantLead = { ...lead };

  if (!detected.email) detected.email = latest.match(/[\w.+-]+@[\w.-]+\.[a-z]{2,}/i)?.[0]?.toLowerCase() || "";
  if (!detected.phone) detected.phone = latest.match(/(?:\+?1[\s.-]?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}/)?.[0] || "";
  if (!detected.name) {
    const rawName = latest.match(/(?:my name is|i'm|i am)\s+([a-z][a-z '-]{0,40})/i)?.[1] || "";
    detected.name = rawName.split(/\s+(?:and|my|phone|number|email|i need|i want)\b/i)[0].trim();
  }
  if (!detected.city) detected.city = extractKnownCity(latest);
  if (!detected.service) {
    if (/ceramic|coating/.test(lower)) detected.service = /(?:one|1)[ -]?year/.test(lower) ? "One-year ceramic coating" : /(?:five|5|seven|7)[ -]?year/.test(lower) ? "Seven-year ceramic coating" : "Ceramic coating";
    else if (/paint correction|polish|buff/.test(lower)) detected.service = "Paint correction / polish";
    else if (/full detail|inside and out|interior.*exterior/.test(lower)) detected.service = "Full interior + exterior detail";
    else if (/interior/.test(lower)) detected.service = "Interior detail";
    else if (/exterior|wash|wax/.test(lower)) detected.service = "Exterior detail";
    else if (/rv|camper|motorhome/.test(lower)) detected.service = "RV detailing";
    else if (/boat|marine/.test(lower)) detected.service = "Marine detailing";
    else if (/fleet|commercial/.test(lower)) detected.service = "Fleet / commercial service";
  }
  if (!detected.vehicle) {
    const vehicleMatch = latest.match(/\b(?:19|20)\d{2}\b[^,.!?\n]{2,80}/i);
    if (vehicleMatch) detected.vehicle = vehicleMatch[0].replace(/\s+(?:in|located in)\s+[a-z ]+$/i, "").trim();
  }
  if (!detected.condition && /pet hair|stain|odor|smoke|mold|dirty|trashed|scratch|swirl|oxidation/i.test(latest)) detected.condition = latest;

  if (/contact you|follow up|reach you|okay.*contact|permission.*contact/.test(previousAssistant) && /^(yes|yeah|yep|sure|okay|ok|that'?s fine|you can)/i.test(latest.trim())) {
    detected.contactAuthorized = true;
  }

  const intent: Intent = /talk|text|call|cole|human|person/.test(lower)
    ? "human"
    : /book|schedule|appointment/.test(lower)
      ? "booking"
      : /price|cost|quote|how much/.test(lower)
        ? "quote"
        : "question";

  let reply = "I can help with that.";
  if (!detected.service) reply = "What service are you looking for—interior, full detail, exterior, paint correction, or ceramic coating?";
  else if (!detected.vehicle) reply = "What’s the year, make, and model of the vehicle? That lets me give you a safer starting estimate.";
  else if (!detected.name) reply = "What’s your name so I can keep the request organized for Cole?";
  else if (!hasContact(detected)) reply = "What phone number or email should Cole use if you want him to follow up?";
  else if (!detected.city) reply = "What city will the vehicle be in?";
  else if (!detected.contactAuthorized) reply = "Is it okay for Cole to contact you about this specific request using the phone number or email you provided?";
  else if (intent === "quote") reply = "I have enough to show a starting estimate and send the request to Cole for confirmation.";
  else reply = "Thanks—I have enough to send the request to Cole and keep everything together.";

  return {
    ...detected,
    reply,
    intent,
    needsHuman: intent === "human",
    escalationReason: intent === "human" ? "Customer asked to speak with Cole." : "",
  };
}

async function moderateInput(apiKey: string, input: string) {
  try {
    const response = await fetch("https://api.openai.com/v1/moderations", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ model: "omni-moderation-latest", input }),
      signal: AbortSignal.timeout(8_000),
    });
    if (!response.ok) return false;
    const result = await response.json() as { results?: Array<{ flagged?: boolean }> };
    return Boolean(result.results?.[0]?.flagged);
  } catch {
    return false;
  }
}

function outputText(response: RawOpenAiResponse) {
  if (typeof response.output_text === "string") return response.output_text;
  return (response.output || [])
    .flatMap((item) => item.content || [])
    .filter((part) => part.type === "output_text" || typeof part.text === "string")
    .map((part) => part.text || "")
    .join("");
}

async function getModelDecision(messages: ChatMessage[], lead: AssistantLead): Promise<ModelDecision> {
  const apiKey = process.env.OPENAI_API_KEY?.trim();
  if (!apiKey) return fallbackDecision(messages, lead);

  const latest = lastUserMessage(messages);
  if (await moderateInput(apiKey, latest)) {
    return {
      ...lead,
      reply: "I can only help with vehicle-detailing questions and quote requests. You can contact Cole directly if you need something outside that scope.",
      intent: "other",
      needsHuman: false,
      escalationReason: "",
    };
  }

  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL?.trim() || "gpt-5-mini",
      store: false,
      instructions: `You are Cole's Mobile Detailing AI website assistant. You are an automated assistant built for Cole's business, not Cole himself. Never pretend to be Cole or a human. The interface already discloses that you are AI, and you should answer honestly if asked.

Tone:
- Sound warm, direct, local, and conversational.
- Keep replies short: usually 1-3 sentences.
- Avoid corporate language, hype, excessive emojis, and the phrase ChatGPT.

Business facts:
- Cole's Mobile Detailing serves Evansville, Newburgh, Boonville, and nearby Southern Indiana areas.
- Treat natural statements such as "the detail will be in Boonville," "I'm located in Boonville," or simply "Boonville" as the city field. Do not ask for the city again once it is known.
- Appointments generally need at least 24 hours notice.
- Services include interior detailing, full interior/exterior detailing, exterior detailing, paint correction/polishing, ceramic coatings, RV/marine work, and fleets.
- Final pricing depends on vehicle size, actual condition, access, location, and scope.
- Photos may be requested before a final quote.

Hard rules:
- Never invent or state dollar amounts. Pricing is calculated separately by server-side business rules.
- Never confirm an appointment, guarantee availability, promise a final price, or claim a binding agreement exists.
- Never guarantee removal of stains, odors, scratches, oxidation, mold, or defects.
- Never request or accept payment-card numbers, bank information, Social Security numbers, passwords, medical information, or government-ID numbers.
- For severe condition, biohazards, heavy pet hair, mold, smoke/urine odor, paint defects, RV/marine, fleet work, unusual travel, or anything uncertain, set needsHuman=true.
- If the customer asks for Cole, a human, or a phone/text follow-up, set intent=human and needsHuman=true.
- Collect missing information naturally: name, phone or email, vehicle year/make/model, requested service, city, preferred date, and condition notes.
- Before saving a lead, get explicit authorization for Cole to contact the customer about this specific request. Set contactAuthorized=true only when the customer clearly says yes/okay or otherwise grants permission. This is not recurring marketing consent.
- Preserve already-known lead fields unless the customer corrects them.
- Infer details from ordinary language, short replies, misspellings, and context. Do not make the customer repeat information that is already present.
- Answer the current question, then ask for at most two closely related missing details in one short question so the process moves quickly.
- Never say or imply that a request was sent, submitted, saved, forwarded, or received by Cole. The server adds a confirmation only after the dashboard verifies delivery.

Known lead fields:
${JSON.stringify(lead)}`,
      input: messages.slice(-14).map((message) => ({ role: message.role, content: message.content })),
      text: {
        format: {
          type: "json_schema",
          name: "cmd_assistant_decision",
          strict: true,
          schema: {
            type: "object",
            additionalProperties: false,
            properties: {
              reply: { type: "string" },
              intent: { type: "string", enum: ["quote", "booking", "question", "human", "other"] },
              needsHuman: { type: "boolean" },
              escalationReason: { type: "string" },
              name: { type: "string" },
              phone: { type: "string" },
              email: { type: "string" },
              vehicle: { type: "string" },
              service: { type: "string" },
              city: { type: "string" },
              preferredDate: { type: "string" },
              condition: { type: "string" },
              contactAuthorized: { type: "boolean" },
            },
            required: [
              "reply", "intent", "needsHuman", "escalationReason", "name", "phone", "email", "vehicle", "service", "city", "preferredDate", "condition", "contactAuthorized",
            ],
          },
        },
        verbosity: "low",
      },
    }),
    signal: AbortSignal.timeout(25_000),
  });

  const result = await response.json().catch(() => ({})) as RawOpenAiResponse;
  if (!response.ok) throw new Error(result.error?.message || "AI response failed.");
  const rawText = outputText(result);
  const parsed = JSON.parse(rawText) as ModelDecision;

  return {
    reply: clean(parsed.reply, 700),
    intent: parsed.intent,
    needsHuman: Boolean(parsed.needsHuman),
    escalationReason: clean(parsed.escalationReason, 300),
    name: clean(parsed.name, 100),
    phone: clean(parsed.phone, 40),
    email: clean(parsed.email, 140).toLowerCase(),
    vehicle: clean(parsed.vehicle, 180),
    service: clean(parsed.service, 140),
    city: clean(parsed.city, 180),
    preferredDate: clean(parsed.preferredDate, 20),
    condition: clean(parsed.condition, 1200),
    contactAuthorized: Boolean(parsed.contactAuthorized),
  };
}

export async function POST(request: Request) {
  const contentType = request.headers.get("content-type") || "";
  if (!contentType.includes("application/json")) {
    return NextResponse.json({ error: "JSON requests are required." }, { status: 415 });
  }

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (limited(`chat:${ip}`)) {
    return NextResponse.json({ error: "Please wait a moment before sending another message." }, { status: 429 });
  }

  const body = await request.json().catch(() => null) as Record<string, unknown> | null;
  if (!body) return NextResponse.json({ error: "Invalid chat request." }, { status: 400 });
  if (body.termsAccepted !== true) {
    return NextResponse.json({ error: "Please acknowledge the AI disclosure, Privacy Policy, and Terms before using chat." }, { status: 400 });
  }

  const rawMessages = Array.isArray(body.messages) ? body.messages : [];
  const messages: ChatMessage[] = rawMessages
    .slice(-14)
    .map((item) => {
      const row = item && typeof item === "object" ? item as Record<string, unknown> : {};
      return {
        role: row.role === "assistant" ? "assistant" as const : "user" as const,
        content: clean(row.content, 800),
      };
    })
    .filter((message) => message.content);

  if (!messages.length) return NextResponse.json({ error: "A message is required." }, { status: 400 });
  const latest = lastUserMessage(messages);
  if (containsSensitiveData(latest)) {
    return NextResponse.json({
      error: "Please remove payment-card, Social Security, banking, password, medical, or other sensitive information before continuing.",
    }, { status: 400 });
  }

  const rawLead = body.lead && typeof body.lead === "object" ? body.lead as Record<string, unknown> : {};
  const currentLead: AssistantLead = {
    name: clean(rawLead.name, 100),
    phone: clean(rawLead.phone, 40),
    email: clean(rawLead.email, 140).toLowerCase(),
    vehicle: clean(rawLead.vehicle, 180),
    service: clean(rawLead.service, 140),
    city: clean(rawLead.city, 180),
    preferredDate: clean(rawLead.preferredDate, 20),
    condition: clean(rawLead.condition, 1200),
    contactAuthorized: rawLead.contactAuthorized === true,
  };

  let decision: ModelDecision;
  let assistantMode: "ai" | "guided" = process.env.OPENAI_API_KEY?.trim() ? "ai" : "guided";
  try {
    decision = await getModelDecision(messages, currentLead);
  } catch {
    assistantMode = "guided";
    decision = fallbackDecision(messages, currentLead);
  }

  // Deterministic extraction backs up the model so natural, typo-heavy answers
  // still fill fields that were already stated in the conversation.
  const heuristicLead = fallbackDecision(messages, currentLead);
  const inferredCity = currentLead.city || decision.city || extractKnownCity(messages.map((message) => message.content).join("\n"));
  const lead = mergeLead(mergeLead(currentLead, heuristicLead), {
    ...decision,
    city: inferredCity,
  });
  const quote = estimateQuote(lead);
  const consentTimestamp = clean(body.consentTimestamp, 40) || new Date().toISOString();
  const conversationId = clean(body.conversationId, 180) || `chat-${Date.now()}`;
  // Explicit contact authorization plus the required request details is itself
  // enough to submit. A final "yes" must not lose the earlier quote/booking intent.
  const shouldCreate = readyForLead(lead) && body.alreadySaved !== true;
  let leadSaved = false;
  let notificationSent = false;
  let deliveryError = "";

  if (shouldCreate) {
    const source = "Website AI assistant";
    const notes = [
      lead.condition ? `Condition: ${lead.condition}` : "",
      decision.escalationReason ? `Escalation: ${decision.escalationReason}` : "",
      quote.ready ? `${quote.label}: ${moneyRange(quote)}. ${quote.reason}` : "",
      `AI disclosure and website terms acknowledged: ${consentTimestamp}.`,
      "Customer authorized contact about this specific request. Not recurring marketing consent.",
      "Conversation transcript:",
      transcript(messages),
    ].filter(Boolean).join("\n").slice(0, 7600);

    try {
      await deliverLeadToPlatform({
        submissionId: conversationId,
        name: lead.name,
        phone: lead.phone,
        email: lead.email,
        vehicle: lead.vehicle,
        request: `${lead.vehicle} — ${lead.service}`,
        service: lead.service,
        city: lead.city,
        preferredDate: lead.preferredDate,
        estimateLow: quote.low,
        estimateHigh: quote.high,
        source,
        notes,
        attribution: body.attribution,
      }, ip);
      leadSaved = true;

      if (body.alreadyNotified !== true) {
        try {
          const notification = await sendOwnerSms({
            ...lead,
            estimateLow: quote.low,
            estimateHigh: quote.high,
            question: latest,
            source,
          }, decision.needsHuman || decision.intent === "human" ? "handoff" : "lead");
          notificationSent = notification.sent;
        } catch {
          notificationSent = false;
        }
      }
    } catch (error) {
      leadSaved = false;
      deliveryError = error instanceof Error ? error.message : "The dashboard did not confirm receipt.";
    }
  }

  // Model text is conversational only; delivery status comes exclusively from
  // the verified platform response below.
  let reply = removeUnverifiedDeliveryClaims(decision.reply) || "Thanks—I have those details.";
  if (quote.ready && decision.intent === "quote") {
    reply = `${reply} The current starting estimate is ${moneyRange(quote)}. ${quote.reason}`;
  }
  if (leadSaved) {
    reply += " I saved the request for Cole to review. He’ll confirm the final price and availability.";
  } else if (shouldCreate && deliveryError) {
    reply = "I have all your details, but Cole’s dashboard did not confirm the request. Nothing was marked as sent. Please tap Retry or use the quote form.";
  } else if ((decision.needsHuman || decision.intent === "human") && !readyForLead(lead)) {
    if (!lead.contactAuthorized && hasContact(lead)) {
      reply += " Before I send it, is it okay for Cole to contact you about this request?";
    } else {
      reply += " I’ll need your name, a phone number or email, vehicle, service, and city before I can send the handoff.";
    }
  } else if (!readyForLead(lead)) {
    const missing = missingLeadFields(lead);
    if (missing.length > 0 && /send|submit|quote|book|schedule|contact|cole/i.test(latest)) {
      reply += ` I still need ${missing.slice(0, 2).join(" and ")}${missing.length > 2 ? " first" : ""}.`;
    }
  }

  return NextResponse.json({
    reply: clean(reply, 1200),
    lead,
    quote,
    leadSaved,
    notificationSent,
    deliveryError: Boolean(deliveryError),
    assistantMode,
  });
}
