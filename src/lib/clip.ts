export type ClipVariant = "logo" | "clean";

export type Clip = {
  id: string;
  sourceUrl: string;
  title: string;
  authorName: string;
  authorHandle: string;
  avatar: string;
  cover: string;
  durationSec: number;
  likes: number;
  comments: number;
  plays: number;
  withLogoUrl: string | null;
  withoutLogoUrl: string | null;
  audioUrl: string | null;
  audioTitle: string | null;
  images: string[];
  fetchedAt: number;
};

export function isPhoto(clip: Clip): boolean {
  return clip.images.length > 0 && clip.durationSec <= 0;
}

export function variantUrl(clip: Clip, variant: ClipVariant): string | null {
  if (variant === "clean") return clip.withoutLogoUrl;
  return clip.withLogoUrl;
}

export function availableVariant(clip: Clip, prefer: ClipVariant): ClipVariant {
  if (prefer === "clean" && clip.withoutLogoUrl) return "clean";
  if (prefer === "logo" && clip.withLogoUrl) return "logo";
  if (clip.withoutLogoUrl) return "clean";
  return "logo";
}

export function fileBase(clip: Clip): string {
  const handle = (clip.authorHandle || "post").replace(/[^\w.-]+/g, "").slice(0, 40) || "post";
  const id = clip.id.replace(/[^\w.-]+/g, "").slice(0, 24) || "clip";
  return `marq-${handle}-${id}`;
}

export function compactCount(n: number): string {
  if (!Number.isFinite(n) || n < 0) return "0";
  if (n < 1000) return String(Math.round(n));
  if (n < 1_000_000) {
    const value = n / 1000;
    const text = value < 10 ? value.toFixed(1) : value.toFixed(0);
    return `${text.replace(/\.0$/, "")}K`;
  }
  const value = n / 1_000_000;
  return `${value.toFixed(value < 10 ? 1 : 0).replace(/\.0$/, "")}M`;
}

export function clock(sec: number): string {
  const s = Math.max(0, Math.round(sec));
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}:${r.toString().padStart(2, "0")}`;
}

export function ago(ts: number, now = Date.now()): string {
  const min = Math.floor(Math.max(0, now - ts) / 60000);
  if (min < 1) return "Just now";
  if (min < 60) return `${min}m ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h ago`;
  return `${Math.floor(hr / 24)}d ago`;
}
