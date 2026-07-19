"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { readStoredAttribution } from "@/components/lead-attribution";

type FormState = {
  name: string;
  phone: string;
  email: string;
  vehicle: string;
  service: string;
  city: string;
  preferredDate: string;
  notes: string;
  referralSource: string;
  website: string;
  acceptedTerms: boolean;
  contactAuthorized: boolean;
};

const initialState: FormState = {
  name: "",
  phone: "",
  email: "",
  vehicle: "",
  service: "",
  city: "",
  preferredDate: "",
  notes: "",
  referralSource: "",
  website: "",
  acceptedTerms: false,
  contactAuthorized: false,
};

export function BookingLeadForm() {
  const [form, setForm] = useState(initialState);
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const minDate = useMemo(() => {
    const date = new Date();
    date.setDate(date.getDate() + 1);
    return date.toISOString().slice(0, 10);
  }, []);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!form.phone.trim() && !form.email.trim()) {
      setStatus("error");
      setMessage("Add a phone number or email so Cole can follow up.");
      return;
    }

    if (!form.acceptedTerms) {
      setStatus("error");
      setMessage("Please review and accept the Privacy Policy and Terms before submitting.");
      return;
    }

    if (!form.contactAuthorized) {
      setStatus("error");
      setMessage("Please authorize Cole to contact you about this specific request.");
      return;
    }

    setStatus("sending");
    setMessage("");
    const attribution = readStoredAttribution();
    const submissionId = typeof crypto !== "undefined" && "randomUUID" in crypto
      ? `lead-${crypto.randomUUID()}`
      : `lead-${Date.now()}`;

    try {
      const response = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          submissionId,
          request: `${form.vehicle} — ${form.service}`,
          source: form.referralSource || "Website",
          attribution,
          consentTimestamp: new Date().toISOString(),
        }),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || "Your request could not be sent.");
      setStatus("success");
      setMessage("Request received. Cole will review the details and follow up as soon as possible.");
      setForm(initialState);
    } catch (caught) {
      setStatus("error");
      setMessage(caught instanceof Error ? caught.message : "Your request could not be sent.");
    }
  }

  return (
    <form className="cmd-lead-form" onSubmit={submit} noValidate>
      <div className="cmd-form-heading">
        <p>PRIVATE QUOTE REQUEST</p>
        <h2>Send the details once.</h2>
        <span>Your request goes directly into Cole&apos;s private lead dashboard so nothing gets lost.</span>
      </div>

      <div className="cmd-form-grid">
        <label>
          <span>Name *</span>
          <input required autoComplete="name" value={form.name} onChange={(event) => update("name", event.target.value)} placeholder="Your name" />
        </label>
        <label>
          <span>Phone</span>
          <input inputMode="tel" autoComplete="tel" value={form.phone} onChange={(event) => update("phone", event.target.value)} placeholder="(812) 555-0123" />
        </label>
        <label>
          <span>Email</span>
          <input type="email" autoComplete="email" value={form.email} onChange={(event) => update("email", event.target.value)} placeholder="you@example.com" />
        </label>
        <label>
          <span>City *</span>
          <input required autoComplete="address-level2" value={form.city} onChange={(event) => update("city", event.target.value)} placeholder="Evansville, Newburgh, Boonville…" />
        </label>
        <label className="cmd-form-wide">
          <span>Vehicle *</span>
          <input required value={form.vehicle} onChange={(event) => update("vehicle", event.target.value)} placeholder="Year, make, model, and size" />
        </label>
        <label>
          <span>Service *</span>
          <select required value={form.service} onChange={(event) => update("service", event.target.value)}>
            <option value="">Choose a service</option>
            <option>Interior detail</option>
            <option>Full interior + exterior detail</option>
            <option>Exterior detail</option>
            <option>Paint correction / polish</option>
            <option>Ceramic coating</option>
            <option>RV or marine detailing</option>
            <option>Fleet / commercial service</option>
            <option>Not sure yet</option>
          </select>
        </label>
        <label>
          <span>Preferred date</span>
          <input type="date" min={minDate} value={form.preferredDate} onChange={(event) => update("preferredDate", event.target.value)} />
        </label>
        <label className="cmd-form-wide">
          <span>Condition and notes</span>
          <textarea value={form.notes} onChange={(event) => update("notes", event.target.value)} placeholder="Pet hair, stains, paint condition, access to water/power, or anything else Cole should know. Do not include payment-card, Social Security, or financial information." />
        </label>
        <label className="cmd-form-wide">
          <span>How did you hear about us?</span>
          <select value={form.referralSource} onChange={(event) => update("referralSource", event.target.value)}>
            <option value="">Choose one</option>
            <option>Google</option>
            <option>Facebook</option>
            <option>Referral</option>
            <option>Repeat customer</option>
            <option>Other</option>
          </select>
        </label>
        <label className="cmd-honeypot" aria-hidden="true">
          Website
          <input tabIndex={-1} autoComplete="off" value={form.website} onChange={(event) => update("website", event.target.value)} />
        </label>
      </div>

      <div className="cmd-consent-stack">
        <label className="cmd-consent-row">
          <input type="checkbox" checked={form.contactAuthorized} onChange={(event) => update("contactAuthorized", event.target.checked)} />
          <span>
            I authorize Cole&apos;s Mobile Detailing to contact me about this specific request using the phone number or email I provided. This does not enroll me in recurring marketing messages.
          </span>
        </label>
        <label className="cmd-consent-row">
          <input type="checkbox" checked={form.acceptedTerms} onChange={(event) => update("acceptedTerms", event.target.checked)} />
          <span>
            I understand this request does not confirm an appointment or final price, and I agree to the <Link href="/terms" target="_blank">Terms</Link> and acknowledge the <Link href="/privacy" target="_blank">Privacy Policy</Link>.
          </span>
        </label>
      </div>

      <div className="cmd-form-footer">
        <button type="submit" disabled={status === "sending"}>
          {status === "sending" ? "Sending request…" : "Request a quote"}
          <span aria-hidden="true">→</span>
        </button>
        <p>Appointments and final pricing are confirmed only after Cole reviews the vehicle, condition, location, and schedule.</p>
      </div>

      <div className={`cmd-form-message ${status}`} aria-live="polite">
        {message}
      </div>
    </form>
  );
}
