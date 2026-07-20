# Cole's Mobile Detailing v6.3 — Ceramic Care, Legal, AI, CRM & SMS

Production-oriented Next.js website for Cole's Mobile Detailing with:

- Transparent AI website assistant
- Controlled, server-calculated starting estimates
- Digital Forge CRM lead delivery
- Owner-only Twilio lead notifications
- Public Privacy Policy, Terms, AI Disclosure, and SMS Consent pages
- Explicit quote-form and chatbot consent records
- Spam limits, honeypots, sensitive-data filtering, security headers, and server-only secrets

## Important legal notice

This release adds practical compliance and risk controls, but it is not legal advice and does not guarantee compliance with every law, carrier rule, contract, or customer dispute. Before relying on the policies publicly, have a licensed Indiana attorney review the exact legal business name, cancellation/payment practices, service warranties, photo usage, liability terms, and SMS program.

## Run locally

1. Copy `.env.example` to `.env.local`.
2. Fill in private values. Never commit `.env.local`.
3. Install and run:

```powershell
npm ci
npm run dev
```

Open `http://localhost:3000`.

## Required public pages

- `/privacy`
- `/terms`
- `/ai-disclosure`
- `/sms-alerts`

## Validation commands

```powershell
npm run typecheck
npm run build
```

See `DEPLOY.md`, `LEGAL-COMPLIANCE-CHECKLIST.md`, and `TWILIO-A2P-SUBMISSION.md` before launch.
