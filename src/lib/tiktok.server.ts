import type { Clip } from "@/lib/clip";

const UA =
  "Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Mobile Safari/537.36";

type TikwmAuthor = {
  unique_id?: string;
  nickname?: string;
  avatar?: string;
};

type TikwmMusic = {
  title?: string;
  play?: string;
};

type TikwmData = {
  id?: string | number;
  title?: string;
  duration?: number;
  cover?: string;
  origin_cover?: string;
  play?: string;
  wmplay?: string;
  hdplay?: string;
  music?: string;
  images?: unknown;
  digg_count?: number;
  comment_count?: number;
  play_count?: number;
  author?: TikwmAuthor;
  music_info?: TikwmMusic;
};

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function assertTikTokUrl(input: string): string {
  const trimmed = input.trim();
  let url: URL;
  try {
    url = new URL(trimmed);
  } catch {
    throw new Error("Paste a full link, including https://");
  }
  if (url.protocol !== "https:" && url.protocol !== "http:") {
    throw new Error("That link needs to start with https://");
  }
  const host = url.hostname.toLowerCase().replace(/^www\./, "");
  const ok = host === "tiktok.com" || host.endsWith(".tiktok.com");
  if (!ok) {
    throw new Error("That doesn’t look like a TikTok link.");
  }
  url.protocol = "https:";
  return url.toString();
}

function asUrl(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (!trimmed.startsWith("http")) return null;
  return trimmed;
}

function imageList(raw: unknown): string[] {
  if (!Array.isArray(raw)) return [];
  const out: string[] = [];
  for (const item of raw) {
    if (typeof item === "string") {
      const url = asUrl(item);
      if (url) out.push(url);
      continue;
    }
    if (item && typeof item === "object" && "url" in item) {
      const url = asUrl((item as { url: unknown }).url);
      if (url) out.push(url);
    }
  }
  return out;
}

function pickVideos(data: TikwmData): { withLogoUrl: string | null; withoutLogoUrl: string | null } {
  const wm = asUrl(data.wmplay);
  const play = asUrl(data.play);
  const hd = asUrl(data.hdplay);
  const clean = hd && hd !== wm ? hd : play && play !== wm ? play : null;
  const withLogoUrl = wm;
  const withoutLogoUrl = clean;
  if (!withLogoUrl && !withoutLogoUrl && play) {
    return { withLogoUrl: null, withoutLogoUrl: play };
  }
  return { withLogoUrl, withoutLogoUrl };
}

async function lookup(pageUrl: string, attempt = 0): Promise<TikwmData> {
  const endpoint = `https://www.tikwm.com/api/?hd=1&url=${encodeURIComponent(pageUrl)}`;
  let response: Response;
  try {
    response = await fetch(endpoint, {
      headers: { Accept: "application/json", "User-Agent": UA },
      signal: AbortSignal.timeout(25000),
    });
  } catch {
    throw new Error("The lookup didn’t answer. Try again in a moment.");
  }
  if (!response.ok) {
    throw new Error("The lookup didn’t answer. Try again in a moment.");
  }
  const json = (await response.json()) as { code?: number; msg?: string; data?: TikwmData };
  if (json.code !== 0 || !json.data) {
    const msg = json.msg || "Couldn’t read that TikTok.";
    if (/limit|too many|request\/second/i.test(msg) && attempt < 2) {
      await sleep(1200);
      return lookup(pageUrl, attempt + 1);
    }
    if (/parse|url|private|not found/i.test(msg)) {
      throw new Error("Couldn’t read that link. Use a public video or photo post.");
    }
    throw new Error("Couldn’t read that TikTok. Check that the post is public.");
  }
  return json.data;
}

export async function resolveTikTok(input: string): Promise<Clip> {
  const sourceUrl = assertTikTokUrl(input);
  const data = await lookup(sourceUrl);
  const videos = pickVideos(data);
  const images = imageList(data.images);
  const audioUrl = asUrl(data.music_info?.play) ?? asUrl(data.music);
  if (!videos.withLogoUrl && !videos.withoutLogoUrl && images.length === 0) {
    throw new Error("No downloadable file on that post. It may be private or a live.");
  }
  const handle = data.author?.unique_id?.trim() || "tiktok";
  const id = String(data.id ?? "");
  return {
    id: id || sourceUrl,
    sourceUrl,
    title: (data.title || "").trim() || "Untitled post",
    authorName: data.author?.nickname?.trim() || handle,
    authorHandle: handle,
    avatar: asUrl(data.author?.avatar) ?? "",
    cover: asUrl(data.origin_cover) ?? asUrl(data.cover) ?? images[0] ?? "",
    durationSec: Number(data.duration) || 0,
    likes: Number(data.digg_count) || 0,
    comments: Number(data.comment_count) || 0,
    plays: Number(data.play_count) || 0,
    withLogoUrl: videos.withLogoUrl,
    withoutLogoUrl: videos.withoutLogoUrl,
    audioUrl,
    audioTitle: data.music_info?.title?.trim() || null,
    images,
    fetchedAt: Date.now(),
  };
}
