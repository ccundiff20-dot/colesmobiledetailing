"use client";

import { useEffect } from "react";

const STORAGE_KEY = "cmd-lead-attribution-v1";
const TRACKED = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "gclid", "gbraid", "wbraid"] as const;

export type StoredAttribution = {
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmTerm?: string;
  utmContent?: string;
  gclid?: string;
  gbraid?: string;
  wbraid?: string;
  landingPage?: string;
  referrer?: string;
  capturedAt?: string;
};

function clean(value: string | null) {
  return (value || "").trim().slice(0, 500);
}

export function readStoredAttribution(): StoredAttribution {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}") as StoredAttribution;
  } catch {
    return {};
  }
}

export function LeadAttributionCapture() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const hasTrackedValue = TRACKED.some((key) => params.has(key));
    const previous = readStoredAttribution();
    const next: StoredAttribution = {
      ...previous,
      landingPage: previous.landingPage || `${window.location.pathname}${window.location.search}`.slice(0, 500),
      referrer: previous.referrer || clean(document.referrer),
      capturedAt: previous.capturedAt || new Date().toISOString(),
    };

    if (hasTrackedValue) {
      next.utmSource = clean(params.get("utm_source")) || previous.utmSource;
      next.utmMedium = clean(params.get("utm_medium")) || previous.utmMedium;
      next.utmCampaign = clean(params.get("utm_campaign")) || previous.utmCampaign;
      next.utmTerm = clean(params.get("utm_term")) || previous.utmTerm;
      next.utmContent = clean(params.get("utm_content")) || previous.utmContent;
      next.gclid = clean(params.get("gclid")) || previous.gclid;
      next.gbraid = clean(params.get("gbraid")) || previous.gbraid;
      next.wbraid = clean(params.get("wbraid")) || previous.wbraid;
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }, []);

  return null;
}
