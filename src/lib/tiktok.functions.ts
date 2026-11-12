import { createServerFn } from "@tanstack/react-start";
import { resolveTikTok } from "@/lib/tiktok.server";

export const resolveClip = createServerFn({ method: "POST" })
  .validator((input: unknown) => {
    if (
      typeof input !== "object" ||
      input === null ||
      !("url" in input) ||
      typeof input.url !== "string"
    ) {
      throw new Error("Paste a TikTok link.");
    }
    return { url: input.url };
  })
  .handler(async ({ data }) => {
    return resolveTikTok(data.url);
  });
