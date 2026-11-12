const ALLOWED_SUFFIXES = [
  "tiktokcdn.com",
  "tiktokcdn-us.com",
  "tiktokcdn-eu.com",
  "tiktokv.com",
  "tiktok.com",
  "musical.ly",
  "ibyteimg.com",
  "byteoversea.com",
  "tikwm.com",
];

export function assertMediaUrl(raw: string): string {
  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    throw new Error("That file link is not valid.");
  }
  if (url.protocol !== "https:") {
    throw new Error("Only secure media links can be saved.");
  }
  const host = url.hostname.toLowerCase();
  const ok = ALLOWED_SUFFIXES.some((suffix) => host === suffix || host.endsWith(`.${suffix}`));
  if (!ok) {
    throw new Error("That file is not from a TikTok media host.");
  }
  return url.toString();
}

export function safeDownloadName(name: string, fallback: string): string {
  const cleaned = name.replace(/[^\w.\-]+/g, "_").replace(/_+/g, "_").slice(0, 80);
  if (!cleaned || cleaned === "." || cleaned === "..") return fallback;
  return cleaned;
}
