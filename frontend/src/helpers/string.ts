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

const AVATAR_COLORS = [
  "bg-[#1f55d6]",
  "bg-[#2f6f5e]",
  "bg-[#3b5ba5]",
  "bg-[#8a4fa3]",
  "bg-[#0e7490]",
  "bg-[#a63d5b]",
  "bg-[#2b3138]",
];

export function getAvatarColor(seed?: string | null): string {
  const s = seed?.trim().toLowerCase() || "?";
  let hash = 0;
  for (let i = 0; i < s.length; i++) hash = (hash * 31 + s.charCodeAt(i)) | 0;
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}
