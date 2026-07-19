export type AssistantLead = {
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

export type QuoteDecision = {
  ready: boolean;
  low: number;
  high: number;
  label: string;
  requiresReview: boolean;
  reason: string;
};

function normalized(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9\s-]/g, " ").replace(/\s+/g, " ").trim();
}

function vehicleTier(vehicle: string): "car" | "midsize" | "large" {
  const value = normalized(vehicle);
  if (/suburban|yukon xl|escalade esv|expedition max|navigator l|sprinter|transit|passenger van|15 passenger|three row|3 row/.test(value)) return "large";
  if (/truck|pickup|suv|crossover|bronco|tahoe|yukon|escalade|expedition|navigator|pilot|highlander|telluride|palisade|minivan|van|jeep|4runner/.test(value)) return "midsize";
  return "car";
}

function riskyCondition(condition: string) {
  const value = normalized(condition);
  return /heavy pet|severe pet|biohazard|vomit|blood|mold|mildew|flood|smoke|urine|feces|roaches|infestation|extreme|trashed|very bad|years of|oxidation|deep scratch|wet sand|overspray/.test(value);
}

function distantCity(city: string) {
  const value = normalized(city);
  if (!value) return false;
  return !/evansville|newburgh|boonville|chandler|warrick|vanderburgh|haubstadt|fort branch|princeton|poseyville|mount vernon|mt vernon/.test(value);
}

export function estimateQuote(lead: AssistantLead): QuoteDecision {
  const service = normalized(lead.service);
  if (!service || !lead.vehicle.trim()) {
    return { ready: false, low: 0, high: 0, label: "", requiresReview: false, reason: "Vehicle and service are needed first." };
  }

  if (riskyCondition(lead.condition)) {
    return {
      ready: true,
      low: 0,
      high: 0,
      label: "Photo review required",
      requiresReview: true,
      reason: "The condition can change the labor and final price, so Cole should review photos first.",
    };
  }

  const tier = vehicleTier(lead.vehicle);
  let low = 0;
  let high = 0;
  let label = "Estimated range";
  let requiresReview = false;
  let reason = "Final pricing depends on the vehicle's actual size and condition.";

  if (/interior/.test(service) && !/exterior|full/.test(service)) {
    [low, high] = tier === "car" ? [199, 229] : tier === "midsize" ? [249, 279] : [279, 349];
  } else if (/full|interior.*exterior|inside.*outside/.test(service)) {
    [low, high] = tier === "car" ? [299, 329] : tier === "midsize" ? [349, 379] : [399, 449];
  } else if (/exterior|wash|wax/.test(service) && !/correction|polish|ceramic/.test(service)) {
    [low, high] = tier === "car" ? [175, 189] : tier === "midsize" ? [199, 219] : [220, 259];
  } else if (/one year|1 year/.test(service) && /ceramic|coating/.test(service)) {
    [low, high] = tier === "car" ? [399, 549] : tier === "midsize" ? [499, 649] : [599, 799];
    reason = "This includes a starting coating estimate; paint preparation can change the final price.";
  } else if (/five year|5 year|seven year|7 year/.test(service) && /ceramic|coating/.test(service)) {
    [low, high] = tier === "car" ? [799, 1350] : tier === "midsize" ? [949, 1550] : [1099, 1800];
    reason = "The final coating package depends on whether the paint needs a one-step or two-step correction.";
  } else if (/ceramic|coating/.test(service)) {
    [low, high] = tier === "car" ? [399, 1350] : tier === "midsize" ? [499, 1550] : [599, 1800];
    label = "Coating options";
    reason = "Cole will narrow this down after confirming coating duration and paint preparation needs.";
  } else if (/paint correction|polish|buff/.test(service)) {
    [low, high] = tier === "car" ? [350, 950] : tier === "midsize" ? [400, 1050] : [500, 1200];
    requiresReview = true;
    label = "Starting correction range";
    reason = "Paint correction depends on defect depth and usually requires photos or an in-person inspection.";
  } else if (/rv|motorhome|camper|boat|marine/.test(service)) {
    requiresReview = true;
    label = "Custom quote required";
    reason = "RV and marine work is priced by size, condition, access, and requested finish.";
  } else if (/fleet|commercial/.test(service)) {
    requiresReview = true;
    label = "Custom fleet quote";
    reason = "Fleet pricing depends on vehicle count, frequency, condition, and location.";
  } else {
    requiresReview = true;
    label = "Cole will review this request";
    reason = "The requested service does not match a standard package closely enough for a safe automated estimate.";
  }

  if (distantCity(lead.city)) {
    requiresReview = true;
    reason += " Travel outside the normal service area may include an additional fee.";
  }

  return { ready: true, low, high, label, requiresReview, reason };
}

export function moneyRange(quote: QuoteDecision) {
  if (!quote.low || !quote.high) return quote.label;
  if (quote.low === quote.high) return `$${quote.low.toLocaleString("en-US")}`;
  return `$${quote.low.toLocaleString("en-US")}–$${quote.high.toLocaleString("en-US")}`;
}
