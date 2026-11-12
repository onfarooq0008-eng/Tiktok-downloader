import { createFileRoute } from "@tanstack/react-router";
import { assertMediaUrl, safeDownloadName } from "@/lib/media-allow";

const UA =
  "Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Mobile Safari/537.36";

async function fetchMedia(start: string, hops = 0): Promise<Response> {
  const url = assertMediaUrl(start);
  const response = await fetch(url, {
    headers: {
      "User-Agent": UA,
      Referer: "https://www.tiktok.com/",
      Accept: "*/*",
    },
    redirect: "manual",
    signal: AbortSignal.timeout(30000),
  });
  if (response.status >= 300 && response.status < 400 && hops < 4) {
    const location = response.headers.get("location");
    if (!location) return response;
    return fetchMedia(new URL(location, url).toString(), hops + 1);
  }
  return response;
}

export const Route = createFileRoute("/api/media")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const query = new URL(request.url).searchParams;
        const src = query.get("src") || "";
        const name = safeDownloadName(query.get("name") || "", "marq-download.mp4");
        try {
          const upstream = await fetchMedia(src);
          if (!upstream.ok || !upstream.body) {
            return Response.json(
              { error: "The file host refused the download. Try again." },
              { status: 502 },
            );
          }
          const length = upstream.headers.get("content-length");
          if (length && Number(length) > 80_000_000) {
            return Response.json({ error: "That file is too large to save here." }, { status: 413 });
          }
          const type = upstream.headers.get("content-type") || "application/octet-stream";
          const headers = new Headers();
          headers.set("Content-Type", type);
          headers.set("Content-Disposition", `attachment; filename="${name}"`);
          headers.set("Cache-Control", "private, no-store");
          headers.set("X-Content-Type-Options", "nosniff");
          if (length) headers.set("Content-Length", length);
          return new Response(upstream.body, { status: 200, headers });
        } catch (error) {
          const message = error instanceof Error ? error.message : "Couldn’t save that file.";
          return Response.json({ error: message }, { status: 400 });
        }
      },
    },
  },
});
