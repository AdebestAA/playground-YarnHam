export function getInitial(name?: string | null, fallback = "?"): string {
  const ch = name?.trim()?.charAt(0) || fallback;
  return ch.toUpperCase();
}

export function getUsernameFromEmail(email?: string | null, fallback = "there"): string {
  if (!email) return fallback;
  return email.split("@")[0] || fallback;
}

export function onlyDigits(value: string): string {
  return value.replace(/\D/g, "");
}
