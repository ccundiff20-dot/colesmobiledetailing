export type WebsiteLeadPayload = {
  submissionId: string;
  name: string;
  phone: string;
  email: string;
  vehicle: string;
  request: string;
  service: string;
  city: string;
  preferredDate: string;
  source: string;
  notes: string;
  estimateLow?: number;
  estimateHigh?: number;
  attribution?: unknown;
};

export async function deliverLeadToPlatform(payload: WebsiteLeadPayload, originatingIp = "unknown") {
  const platformUrl = process.env.DF_PLATFORM_URL?.replace(/\/$/, "");
  const workspaceId = process.env.DF_PLATFORM_WORKSPACE_ID;
  const ingestKey = process.env.DF_PLATFORM_INGEST_KEY;

  if (!platformUrl || !workspaceId || !ingestKey) {
    throw new Error("The lead connection is not configured.");
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 12_000);
  try {
    const response = await fetch(`${platformUrl}/api/platform/lead`, {
      method: "POST",
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        "x-originating-ip": originatingIp,
      },
      body: JSON.stringify({
        ...payload,
        workspaceId,
        ingestKey,
      }),
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(typeof result.error === "string" ? result.error : "The lead could not be saved.");
    }
    return result;
  } finally {
    clearTimeout(timer);
  }
}
