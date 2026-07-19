# Legal & Compliance Launch Checklist

This checklist reduces risk but is not a substitute for legal advice.

## Business identity

- [ ] Confirm the exact legal entity/name on the IRS EIN letter.
- [ ] Set `NEXT_PUBLIC_LEGAL_BUSINESS_NAME` to that exact name.
- [ ] Confirm the DBA, business email, phone, and service area are accurate.
- [ ] Have an Indiana attorney review the public policies and service practices.

## Website policies

- [ ] `/privacy` is public without login.
- [ ] `/terms` is public without login.
- [ ] `/ai-disclosure` is public without login.
- [ ] `/sms-alerts` is public without login.
- [ ] Footer links work on desktop and mobile.
- [ ] Privacy policy states mobile information and SMS consent are not sold or shared for third-party marketing.
- [ ] Privacy policy states message frequency varies and message/data rates may apply.
- [ ] Terms accurately match actual cancellation, deposit, payment, photo, warranty, and service practices.

## AI assistant

- [ ] The interface says it is an AI assistant and not Cole.
- [ ] The user accepts the AI disclosure, Terms, and Privacy Policy before chatting.
- [ ] The assistant never claims to be human.
- [ ] Dollar estimates come from server-side pricing rules, not invented model output.
- [ ] Every estimate is described as nonbinding and subject to condition review.
- [ ] The assistant cannot confirm an appointment or guarantee results.
- [ ] Severe conditions, biohazards, heavy pet hair, mold, odor, paint correction, coating prep, RV/marine, fleet, and unusual travel escalate to Cole.
- [ ] Users are warned not to enter payment-card, banking, Social Security, password, medical, or government-ID information.
- [ ] OpenAI keys remain server-side.
- [ ] Review transcripts and assistant behavior regularly for errors.

## Lead and contact consent

- [ ] Quote form requires acceptance of Privacy/Terms.
- [ ] Quote form separately authorizes contact about the specific request.
- [ ] The contact authorization is not described as recurring marketing consent.
- [ ] Chatbot obtains explicit authorization before creating a contactable lead.
- [ ] Consent timestamp and disclosure language are stored with the lead.
- [ ] No prechecked marketing or SMS boxes are used.

## Twilio owner alerts

- [ ] Current campaign is accurately registered as owner/authorized-staff operational alerts only.
- [ ] Recipient personally opted in.
- [ ] `OWNER_SMS_OPTED_IN=true` is set only after that consent.
- [ ] Actual messages identify Cole's Mobile Detailing.
- [ ] Actual messages include STOP and HELP instructions.
- [ ] Twilio sender is registered/approved for the intended traffic.
- [ ] Advanced Opt-Out is enabled where available.
- [ ] STOP and HELP are tested.
- [ ] Customer phone numbers are not enrolled in this internal campaign.
- [ ] A future customer-texting program uses its own separate, voluntary opt-in and campaign.

## Security and data handling

- [ ] `.env.local` is ignored by Git.
- [ ] Netlify environment variables contain all production secrets.
- [ ] No secrets appear in browser bundles, source code, screenshots, or chat messages.
- [ ] Supabase service-role access remains server-only.
- [ ] Unique passwords and MFA are used for GitHub, Netlify, Supabase, OpenAI, and Twilio.
- [ ] Collect only information needed for detailing and follow-up.
- [ ] Backups and recovery are tested.
- [ ] A written incident-response contact list exists.
- [ ] If a breach occurs, investigate promptly and determine Indiana consumer/Attorney General notification duties.

## Ongoing review

- [ ] Recheck policies when adding payments, customer SMS, scheduling, photo uploads, employees, or new vendors.
- [ ] Review pricing rules whenever public prices change.
- [ ] Archive the policy version/effective date used for each major launch.
- [ ] Keep Twilio registration details aligned with actual message traffic.
