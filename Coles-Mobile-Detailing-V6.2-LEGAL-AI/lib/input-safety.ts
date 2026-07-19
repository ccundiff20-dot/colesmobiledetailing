function passesLuhn(digits: string) {
  let sum = 0;
  let double = false;
  for (let index = digits.length - 1; index >= 0; index -= 1) {
    let value = Number(digits[index]);
    if (double) {
      value *= 2;
      if (value > 9) value -= 9;
    }
    sum += value;
    double = !double;
  }
  return sum % 10 === 0;
}

export function containsSensitiveData(value: string) {
  const text = value.trim();
  if (!text) return false;
  if (/\b\d{3}-\d{2}-\d{4}\b/.test(text)) return true;
  if (/\b(?:social security|ssn|bank account|routing number|credit card|debit card|cvv|security code|online banking|account password|login password)\b/i.test(text)) return true;

  const candidates = text.match(/(?:^|[^\d])((?:\d[ -]?){13,19})(?=$|[^\d])/g) || [];
  return candidates.some((candidate) => {
    const normalized = candidate.trim().replace(/^[^\d]+|[^\d]+$/g, "");
    if (/^\d{10}[ -]+(?:19|20)\d{2}$/.test(normalized)) return false;
    const digits = normalized.replace(/\D/g, "");
    return digits.length >= 13 && digits.length <= 19 && passesLuhn(digits);
  });
}
