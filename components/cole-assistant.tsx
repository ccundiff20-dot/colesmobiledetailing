"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { readStoredAttribution } from "@/components/lead-attribution";

type Message = { id: string; role: "user" | "assistant"; content: string };
type Lead = {
  name: string;
  phone: string;
  email: string;
  vehicle: string;
  service: string;
  city: string;
  preferredDate: string;
  condition: string;
  contactAuthorized: boolean;
};
type Quote = { ready: boolean; low: number; high: number; label: string; requiresReview: boolean; reason: string };

type ChatResult = {
  reply?: string;
  lead?: Lead;
  quote?: Quote;
  leadSaved?: boolean;
  notificationSent?: boolean;
  deliveryError?: boolean;
  assistantMode?: "ai" | "guided";
  error?: string;
};

const INITIAL_MESSAGE: Message = {
  id: "welcome",
  role: "assistant",
  content: "Hey! I’m Cole’s AI website assistant—not Cole himself. I can help with services, starting estimates, or organizing a request for Cole to review. What are you looking to have detailed?",
};

const EMPTY_LEAD: Lead = {
  name: "",
  phone: "",
  email: "",
  vehicle: "",
  service: "",
  city: "",
  preferredDate: "",
  condition: "",
  contactAuthorized: false,
};

const STORAGE_KEY = "cmd-assistant-v2";

function newId(prefix: string) {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return `${prefix}-${crypto.randomUUID()}`;
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function formatRange(quote: Quote) {
  if (!quote.low || !quote.high) return quote.label;
  return `$${quote.low.toLocaleString("en-US")}–$${quote.high.toLocaleString("en-US")}`;
}

export function ColeAssistant() {
  const [open, setOpen] = useState(false);
  const [consentAccepted, setConsentAccepted] = useState(false);
  const [consentTimestamp, setConsentTimestamp] = useState("");
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [lead, setLead] = useState<Lead>(EMPTY_LEAD);
  const [quote, setQuote] = useState<Quote | null>(null);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [leadSaved, setLeadSaved] = useState(false);
  const [alreadyNotified, setAlreadyNotified] = useState(false);
  const [conversationId, setConversationId] = useState(() => newId("chat"));
  const [error, setError] = useState("");
  const [deliveryFailed, setDeliveryFailed] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    try {
      const saved = JSON.parse(sessionStorage.getItem(STORAGE_KEY) || "null") as {
        consentAccepted?: boolean;
        consentTimestamp?: string;
        messages?: Message[];
        lead?: Lead;
        quote?: Quote | null;
        leadSaved?: boolean;
        alreadyNotified?: boolean;
        conversationId?: string;
      } | null;
      if (saved?.consentAccepted) setConsentAccepted(true);
      if (saved?.consentTimestamp) setConsentTimestamp(saved.consentTimestamp);
      if (saved?.messages?.length) setMessages(saved.messages.slice(-18));
      if (saved?.lead) setLead(saved.lead);
      if (saved?.quote) setQuote(saved.quote);
      if (saved?.leadSaved) setLeadSaved(true);
      if (saved?.alreadyNotified) setAlreadyNotified(true);
      if (saved?.conversationId) setConversationId(saved.conversationId);
    } catch {
      // A broken local session should never stop the assistant from opening.
    }
  }, []);

  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify({
        consentAccepted,
        consentTimestamp,
        messages,
        lead,
        quote,
        leadSaved,
        alreadyNotified,
        conversationId,
      }));
    } catch {
      // Session storage is optional.
    }
  }, [consentAccepted, consentTimestamp, messages, lead, quote, leadSaved, alreadyNotified, conversationId]);

  useEffect(() => {
    if (!open || !consentAccepted) return;
    requestAnimationFrame(() => {
      scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
      inputRef.current?.focus();
    });
  }, [open, consentAccepted, messages, sending]);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const quickReplies = useMemo(() => {
    if (messages.length > 2 || sending) return [];
    return ["Get a quote", "Interior detail", "Ceramic coating", "Talk to Cole"];
  }, [messages.length, sending]);

  function startChat() {
    const timestamp = new Date().toISOString();
    setConsentAccepted(true);
    setConsentTimestamp(timestamp);
  }

  async function send(content: string) {
    const trimmed = content.trim();
    if (!trimmed || sending || !consentAccepted) return;
    setError("");
    setInput("");
    const nextMessages = [...messages, { id: newId("user"), role: "user" as const, content: trimmed }];
    setMessages(nextMessages);
    setSending(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversationId,
          messages: nextMessages.map(({ role, content: messageContent }) => ({ role, content: messageContent })),
          lead,
          alreadyNotified,
          alreadySaved: leadSaved,
          attribution: readStoredAttribution(),
          termsAccepted: true,
          consentTimestamp,
        }),
      });
      const result = await response.json().catch(() => ({})) as ChatResult;
      if (!response.ok) throw new Error(result.error || "The assistant couldn’t reply right now.");

      if (result.lead) setLead(result.lead);
      if (result.quote?.ready) setQuote(result.quote);
      if (result.leadSaved) setLeadSaved(true);
      setDeliveryFailed(Boolean(result.deliveryError));
      if (result.notificationSent) setAlreadyNotified(true);
      setMessages((current) => [...current, {
        id: newId("assistant"),
        role: "assistant",
        content: result.reply || "I’m sorry, I couldn’t finish that response. You can still text Cole at 812-629-5544.",
      }]);
    } catch (caught) {
      const message = caught instanceof Error ? caught.message : "The assistant is temporarily unavailable.";
      setError(message);
      setMessages((current) => [...current, {
        id: newId("assistant"),
        role: "assistant",
        content: "I’m having trouble connecting right now. You can use the quote form or text Cole directly at 812-629-5544.",
      }]);
    } finally {
      setSending(false);
    }
  }

  function reset() {
    setMessages([INITIAL_MESSAGE]);
    setLead(EMPTY_LEAD);
    setQuote(null);
    setLeadSaved(false);
    setAlreadyNotified(false);
    setConversationId(newId("chat"));
    setError("");
    setDeliveryFailed(false);
  }

  return (
    <div className={`cole-assistant ${open ? "is-open" : ""}`}>
      <button
        className="cole-assistant-launcher"
        type="button"
        aria-expanded={open}
        aria-controls="cole-assistant-panel"
        onClick={() => setOpen((value) => !value)}
      >
        <span className="cole-assistant-launcher-mark" aria-hidden="true">AI</span>
        <span className="cole-assistant-launcher-copy">
          <b>Ask Cole&apos;s AI assistant</b>
          <small>Quotes &amp; questions</small>
        </span>
        <span className="cole-assistant-launcher-status" aria-hidden="true" />
      </button>

      <section id="cole-assistant-panel" className="cole-assistant-panel" aria-label="Cole's Mobile Detailing AI assistant">
        <header className="cole-assistant-header">
          <div className="cole-assistant-avatar" aria-hidden="true">AI</div>
          <div>
            <p>Cole&apos;s AI Assistant</p>
            <span><i /> Automated assistant · not Cole</span>
          </div>
          <button type="button" onClick={() => setOpen(false)} aria-label="Close assistant">×</button>
        </header>

        {!consentAccepted ? (
          <div className="cole-assistant-consent">
            <p className="cole-assistant-consent-kicker">BEFORE YOU START</p>
            <h3>Helpful automation, with Cole in control.</h3>
            <p>
              This is an AI assistant. It can make mistakes and only provides nonbinding starting estimates. Cole confirms final pricing, results, and appointments.
            </p>
            <ul>
              <li>Do not enter card, banking, Social Security, password, or medical information.</li>
              <li>Chat messages may be processed by an AI provider and saved with a lead when you request follow-up.</li>
              <li>You can skip AI and use the quote form or contact Cole directly.</li>
            </ul>
            <button type="button" onClick={startChat}>Start AI chat</button>
            <small>
              By starting, you acknowledge the <Link href="/ai-disclosure" target="_blank">AI Disclosure</Link> and agree to the <Link href="/terms" target="_blank">Terms</Link> and <Link href="/privacy" target="_blank">Privacy Policy</Link>.
            </small>
          </div>
        ) : (
          <>
            <div className="cole-assistant-notice">
              AI-assisted. Starting estimates only. Final pricing and appointments are confirmed by Cole. <Link href="/ai-disclosure" target="_blank">How this works</Link>
            </div>

            <div className="cole-assistant-messages" ref={scrollRef} aria-live="polite">
              {messages.map((message) => (
                <div key={message.id} className={`cole-assistant-message ${message.role}`}>
                  <p>{message.content}</p>
                </div>
              ))}

              {sending && (
                <div className="cole-assistant-message assistant typing" aria-label="Assistant is typing">
                  <span /><span /><span />
                </div>
              )}

              {quote?.ready && (
                <article className="cole-assistant-quote">
                  <span>{quote.label}</span>
                  <strong>{formatRange(quote)}</strong>
                  <p>{quote.reason}</p>
                </article>
              )}

              {leadSaved && (
                <div className="cole-assistant-saved">
                  <span aria-hidden="true">✓</span>
                  <div><b>Sent to Cole</b><small>Your authorized request is saved in his private lead dashboard.</small></div>
                </div>
              )}

              {deliveryFailed && !leadSaved && (
                <div className="cole-assistant-saved is-error" role="alert">
                  <span aria-hidden="true">!</span>
                  <div><b>Not sent yet</b><small>The dashboard did not confirm receipt. Your details are still here.</small></div>
                </div>
              )}

              {quickReplies.length > 0 && (
                <div className="cole-assistant-quick-replies">
                  {quickReplies.map((reply) => <button key={reply} type="button" onClick={() => void send(reply)}>{reply}</button>)}
                </div>
              )}
            </div>

            <div className="cole-assistant-composer">
              <input
                ref={inputRef}
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !event.shiftKey) {
                    event.preventDefault();
                    void send(input);
                  }
                }}
                placeholder="Ask about pricing or services…"
                aria-label="Message Cole's AI assistant"
                disabled={sending}
                maxLength={800}
              />
              <button type="button" onClick={() => void send(input)} disabled={sending || !input.trim()} aria-label="Send message">→</button>
            </div>

            {deliveryFailed && !leadSaved && (
              <button className="cole-assistant-retry" type="button" disabled={sending} onClick={() => void send("Retry sending my request to Cole")}>Retry sending to Cole</button>
            )}

            <footer className="cole-assistant-footer">
              <button type="button" onClick={reset}>Start over</button>
              <a href="sms:+18126295544">Text Cole directly</a>
            </footer>
            {error && <p className="cole-assistant-error">{error}</p>}
          </>
        )}
      </section>
    </div>
  );
}
