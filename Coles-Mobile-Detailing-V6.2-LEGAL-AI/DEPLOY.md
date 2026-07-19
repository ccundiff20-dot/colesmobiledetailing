# Deployment Guide — v6.2

## 1. Protect the current live site

Keep a copy of the existing production repository and Netlify deploy before replacing code. Do not upload `.env.local`, `node_modules`, or `.next`.

## 2. Confirm legal identity

In Netlify, set:

```text
NEXT_PUBLIC_LEGAL_BUSINESS_NAME
```

Use the exact legal name shown on the IRS EIN confirmation letter if it differs from the public DBA “Cole's Mobile Detailing.”

## 3. Add server environment variables

In the Cole's Mobile Detailing Netlify project, configure:

```text
DF_PLATFORM_URL
DF_PLATFORM_WORKSPACE_ID
DF_PLATFORM_INGEST_KEY
DF_OWNER_DASHBOARD_URL
OPENAI_API_KEY
OPENAI_MODEL
TWILIO_ACCOUNT_SID
TWILIO_AUTH_TOKEN
TWILIO_FROM_NUMBER
TWILIO_MESSAGING_SERVICE_SID
OWNER_NOTIFICATION_PHONE
OWNER_SMS_OPTED_IN
```

Use either `TWILIO_FROM_NUMBER` or `TWILIO_MESSAGING_SERVICE_SID`. Do not expose server keys through `NEXT_PUBLIC_` variables.

Keep `OWNER_SMS_OPTED_IN=false` until the owner or authorized recipient has explicitly opted in and the Twilio sender/campaign is ready for testing.

## 4. Local production checks

```powershell
npm ci
npm run typecheck
npm run build
npm run dev
```

Test:

- Home page and navigation
- `/book` submission and consent checkboxes
- AI disclosure gate before chat begins
- Straightforward quote estimate
- Severe-condition escalation
- Human follow-up authorization
- Lead appearing in Digital Forge
- Public legal pages

## 5. Commit and deploy

```powershell
git add .
git status
git commit -m "Upgrade CMD to v6.2 legal AI compliance"
git push
```

Confirm `.env.local` does not appear in `git status` or GitHub.

After Netlify publishes, verify:

- `https://colesmobiledetail.com/privacy`
- `https://colesmobiledetail.com/terms`
- `https://colesmobiledetail.com/ai-disclosure`
- `https://colesmobiledetail.com/sms-alerts`

## 6. Twilio activation

Only after the public pages are live:

1. Complete A2P registration using `TWILIO-A2P-SUBMISSION.md`.
2. Add the approved number to the Messaging Service sender pool if using one.
3. Enable Twilio Advanced Opt-Out where available.
4. Set `OWNER_SMS_OPTED_IN=true` in Netlify.
5. Clear cache and redeploy.
6. Submit a controlled test lead to your own opted-in number.
7. Test STOP and HELP behavior through Twilio.

## 7. OpenAI activation

The assistant uses server-side HTTPS calls to the OpenAI Responses API and moderation endpoint. The API key must exist only in `.env.local` and Netlify environment variables. Test the assistant after deployment and monitor API usage limits.

## 8. Production monitoring

Review Netlify function logs, Digital Forge leads, Twilio delivery logs, and OpenAI usage. Rotate credentials immediately if any secret is exposed.
