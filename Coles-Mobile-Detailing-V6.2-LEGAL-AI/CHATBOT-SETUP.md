# Cole's AI Assistant Setup — v6.2

The website assistant is deliberately identified as AI. It can sound natural and follow Cole's business rules, but it must never claim to be Cole or a human.

## What works

- AI disclosure and acknowledgement before chat begins
- Natural AI replies when `OPENAI_API_KEY` is configured
- Guided quote flow when OpenAI is not configured
- Server-side pricing rules so the model does not invent prices
- Digital Forge lead creation with Google Ads/UTM attribution
- Conversation and consent record saved with the lead
- Explicit authorization before Cole contacts the customer
- Human escalation for uncertain or condition-heavy work
- Optional owner-only SMS notification through Twilio

## Local configuration

Copy `.env.example` to `.env.local` and fill in private values.

### Digital Forge

```env
DF_PLATFORM_URL=https://digitalforgeplatform.netlify.app
DF_PLATFORM_WORKSPACE_ID=cmd
DF_PLATFORM_INGEST_KEY=the-same-private-cmd-key-used-by-the-platform
DF_OWNER_DASHBOARD_URL=https://digitalforgeplatform.netlify.app/dashboard/leads
```

### OpenAI

```env
OPENAI_API_KEY=your-server-side-openai-api-key
OPENAI_MODEL=gpt-5-mini
```

The code uses server-side fetch requests to the Responses API and moderation endpoint. No OpenAI secret is sent to the browser.

### Twilio owner alerts

```env
TWILIO_ACCOUNT_SID=your-account-sid
TWILIO_AUTH_TOKEN=your-auth-token
TWILIO_FROM_NUMBER=your-sms-capable-twilio-number
TWILIO_MESSAGING_SERVICE_SID=
OWNER_NOTIFICATION_PHONE=your-opted-in-mobile-number-in-e164-format
OWNER_SMS_OPTED_IN=false
```

Use either `TWILIO_FROM_NUMBER` or `TWILIO_MESSAGING_SERVICE_SID`. Set `OWNER_SMS_OPTED_IN=true` only after the owner or authorized staff recipient has explicitly opted in and the sender is ready for testing.

## Test sequence

1. Run `npm ci`.
2. Run `npm run dev`.
3. Open `http://localhost:3000`.
4. Read and accept the AI disclosure screen.
5. Ask: `How much is a full detail on a 2021 Tahoe?`
6. Test a severe-condition request to confirm human review.
7. Provide contact details and explicitly authorize Cole to follow up.
8. Confirm the lead appears in Digital Forge with transcript and consent notes.
9. After Twilio approval and recipient opt-in, test the owner notification.
10. Test `/book` separately.

## Quote safety

The assistant may show nonbinding starting ranges for standard jobs. It routes these to Cole for review:

- Severe pet hair, heavy staining, mold, biohazards, smoke, urine, flood damage, or infestations
- Paint correction, deep defects, and coating preparation uncertainty
- RV, marine, fleet, commercial, or unusual travel requests
- Anything outside the known catalog or pricing rules

The assistant cannot confirm an appointment, promise availability, give a binding final price, or guarantee a result.

## Privacy and secrets

- Never commit `.env.local`.
- Never place OpenAI, Twilio, Supabase, or Digital Forge secrets in client-side code.
- Do not request sensitive personal or financial information through chat.
- Review `LEGAL-COMPLIANCE-CHECKLIST.md` before deployment.
