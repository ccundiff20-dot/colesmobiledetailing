# Release Notes — v6.2 Legal, AI & Compliance Upgrade

## Added

- Public Privacy Policy, Terms and Conditions, AI Assistant Disclosure, and SMS Alerts & Consent pages.
- Legal-policy links across site footers and sitemap.
- Clear chatbot disclosure that the assistant is automated and is not Cole.
- Pre-chat acknowledgement of AI limitations, Privacy Policy, and Terms.
- Separate authorization for Cole to contact a lead about the specific request.
- Consent timestamps and disclosure records stored with lead notes.
- Controlled server-side quote ranges aligned with the current public service pricing.
- Human escalation for severe/uncertain conditions and direct requests for Cole.
- Owner-only Twilio notification opt-in gate.
- Brand identification, STOP, and HELP language in owner alerts.
- Input rate limits, honeypot checks, sensitive-data detection, moderation, request timeouts, and security headers.
- Server-side OpenAI Responses API integration without the OpenAI npm package.
- Public npm registry lockfile to avoid the prior internal-registry installation timeout.
- Deployment, A2P submission, and legal-compliance documentation.

## Important limitations

- Private OpenAI, Twilio, Netlify, and Digital Forge credentials were not included or live-tested.
- Twilio delivery depends on account configuration, sender registration, campaign approval, recipient opt-in, and carrier behavior.
- Public legal text must be reviewed against the business’s actual practices and by qualified counsel before being relied upon.
