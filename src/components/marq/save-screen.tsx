import { useEffect, useState, type FormEvent } from "react";
import { ClipboardPaste, Heart, MessageCircle, Music, Play } from "lucide-react";
import { resolveClip } from "@/lib/tiktok.functions";
import {
  availableVariant,
  clock,
  compactCount,
  fileBase,
  isPhoto,
  variantUrl,
  type Clip,
  type ClipVariant,
} from "@/lib/clip";
import { useShelf } from "@/lib/shelf";
import { saveRemoteFile } from "@/components/marq/save-file";

const SAMPLE = "https://www.tiktok.com/@scout2015/video/6718335390845095173";

function errorText(error: unknown): string {
  if (error instanceof Error && error.message) return error.message.replace(/^Error:\s*/, "");
  return "Something went wrong. Try that link again.";
}

export function SaveScreen({ launch }: { launch?: string | null }) {
  const setPrefer = useShelf((state) => state.setPrefer);
  const remember = useShelf((state) => state.remember);
  const [url, setUrl] = useState("");
  const [clip, setClip] = useState<Clip | null>(null);
  const [variant, setVariant] = useState<ClipVariant>("clean");
  const [busy, setBusy] = useState<"fetch" | "file" | "audio" | null>(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  async function fetchUrl(next: string) {
    const preferNow = useShelf.getState().prefer;
    setBusy("fetch");
    setError("");
    setNotice("");
    try {
      const result = await resolveClip({ data: { url: next } });
      setClip(result);
      setVariant(availableVariant(result, preferNow));
      remember(result);
      setNotice("Saved to your shelf on this device.");
    } catch (err) {
      setError(errorText(err));
    } finally {
      setBusy(null);
    }
  }

  useEffect(() => {
    if (!launch) return;
    const next = launch.slice(launch.indexOf("|") + 1);
    if (!next) return;
    setUrl(next);
    void fetchUrl(next);
    // launch is the only trigger; fetchUrl reads the latest shelf preference itself.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [launch]);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    await fetchUrl(url);
  }

  async function downloadChosen() {
    if (!clip) return;
    const fileUrl = variantUrl(clip, variant);
    if (!fileUrl) return;
    setBusy("file");
    setError("");
    try {
      const tag = variant === "clean" ? "no-logo" : "with-logo";
      await saveRemoteFile(fileUrl, `${fileBase(clip)}-${tag}.mp4`);
    } catch (err) {
      setError(errorText(err));
    } finally {
      setBusy(null);
    }
  }

  async function downloadAudio() {
    if (!clip?.audioUrl) return;
    setBusy("audio");
    setError("");
    try {
      const ext = clip.audioUrl.includes("audio_mpeg") || clip.audioUrl.includes(".mp3") ? "mp3" : "m4a";
      await saveRemoteFile(clip.audioUrl, `${fileBase(clip)}-sound.${ext}`);
    } catch (err) {
      setError(errorText(err));
    } finally {
      setBusy(null);
    }
  }

  async function downloadImage(imageUrl: string, index: number) {
    if (!clip) return;
    setBusy("file");
    setError("");
    try {
      await saveRemoteFile(imageUrl, `${fileBase(clip)}-photo-${index + 1}.jpg`);
    } catch (err) {
      setError(errorText(err));
    } finally {
      setBusy(null);
    }
  }

  function choose(next: ClipVariant) {
    setVariant(next);
    setPrefer(next);
  }

  const photo = clip ? isPhoto(clip) : false;
  const activeUrl = clip ? variantUrl(clip, variant) : null;

  return (
    <div className="flex flex-col gap-5 px-5 pt-2 pb-8">
      <header>
        <p className="text-xs font-medium tracking-widest text-copper uppercase">Save</p>
        <h1 className="font-display mt-1 text-4xl leading-none font-semibold text-fg">
          With the logo.
          <br />
          Or without.
        </h1>
      </header>

      <form onSubmit={onSubmit} className="flex flex-col gap-3">
        <label htmlFor="tiktok-url" className="text-sm text-muted">
          Public TikTok link
        </label>
        <div className="flex gap-2">
          <input
            id="tiktok-url"
            value={url}
            onChange={(event) => setUrl(event.target.value)}
            placeholder="https://www.tiktok.com/..."
            inputMode="url"
            autoCapitalize="off"
            autoCorrect="off"
            spellCheck={false}
            className="min-h-12 min-w-0 flex-1 rounded-2xl border border-line bg-surface px-4 text-base text-fg outline-none placeholder:text-faint focus:border-copper"
          />
          <button
            type="button"
            className="inline-flex min-h-12 min-w-12 items-center justify-center rounded-2xl bg-raised text-fg"
            aria-label="Paste link"
            onClick={() => {
              void navigator.clipboard
                .readText()
                .then((text) => {
                  if (text) setUrl(text.trim());
                })
                .catch(() => {
                  setError("Clipboard is blocked. Paste the link into the field.");
                });
            }}
          >
            <ClipboardPaste className="size-5" />
          </button>
        </div>
        <button
          type="submit"
          disabled={busy === "fetch" || url.trim().length === 0}
          className="min-h-12 rounded-2xl bg-copper text-base font-semibold text-on-copper disabled:opacity-50"
        >
          {busy === "fetch" ? "Reading the post…" : "Fetch post"}
        </button>
        <button
          type="button"
          className="min-h-11 text-sm font-medium text-muted underline decoration-line underline-offset-4"
          onClick={() => {
            setUrl(SAMPLE);
            void fetchUrl(SAMPLE);
          }}
        >
          Try a public sample
        </button>
      </form>

      {busy === "fetch" ? (
        <div className="overflow-hidden rounded-full bg-raised" aria-hidden="true">
          <div className="marq-sweep" />
        </div>
      ) : null}

      {error ? (
        <p className="rounded-2xl bg-surface px-4 py-3 text-sm text-fg" role="alert">
          {error}
        </p>
      ) : null}

      {clip ? (
        <article className="flex flex-col gap-4 rounded-3xl bg-surface p-4">
          <div className="flex items-center gap-3">
            {clip.avatar ? (
              <img src={clip.avatar} alt="" className="size-11 rounded-full object-cover" />
            ) : (
              <span className="size-11 rounded-full bg-raised" />
            )}
            <div className="min-w-0">
              <p className="truncate font-medium text-fg">{clip.authorName}</p>
              <p className="truncate text-sm text-muted">@{clip.authorHandle}</p>
            </div>
          </div>

          <p className="line-clamp-3 text-sm text-fg">{clip.title}</p>

          <p className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted">
            {clip.durationSec > 0 ? <span>{clock(clip.durationSec)}</span> : null}
            <span className="inline-flex items-center gap-1">
              <Play className="size-3.5" /> {compactCount(clip.plays)}
            </span>
            <span className="inline-flex items-center gap-1">
              <Heart className="size-3.5" /> {compactCount(clip.likes)}
            </span>
            <span className="inline-flex items-center gap-1">
              <MessageCircle className="size-3.5" /> {compactCount(clip.comments)}
            </span>
          </p>

          {photo ? (
            <PhotoSet clip={clip} busy={busy === "file"} onSave={downloadImage} />
          ) : (
            <VideoSet
              clip={clip}
              variant={variant}
              activeUrl={activeUrl}
              busy={busy === "file"}
              onChoose={choose}
              onDownload={() => void downloadChosen()}
            />
          )}

          {clip.audioUrl ? (
            <button
              type="button"
              disabled={busy === "audio"}
              onClick={() => void downloadAudio()}
              className="flex min-h-12 w-full min-w-0 items-center justify-center gap-2 rounded-2xl bg-raised px-4 text-sm font-medium text-fg disabled:opacity-50"
            >
              <Music className="size-4 shrink-0" />
              <span className="truncate">
                {busy === "audio" ? "Saving sound…" : clip.audioTitle ? `Save sound · ${clip.audioTitle}` : "Save sound"}
              </span>
            </button>
          ) : null}

          <a
            href={clip.sourceUrl}
            target="_blank"
            rel="noreferrer"
            className="text-center text-sm text-muted underline decoration-line underline-offset-4"
          >
            Open the original post
          </a>

          {notice ? <p className="text-center text-xs text-muted">{notice}</p> : null}
        </article>
      ) : (
        <p className="text-sm text-muted">
          Paste a video or photo link. Marq asks for the files TikTok already published — one with the moving logo, and the clean one when it exists.
        </p>
      )}

      <p className="text-xs text-faint">
        Only save posts you’re allowed to keep. Private and friends-only posts won’t resolve.
      </p>
    </div>
  );
}

function VideoSet({
  clip,
  variant,
  activeUrl,
  busy,
  onChoose,
  onDownload,
}: {
  clip: Clip;
  variant: ClipVariant;
  activeUrl: string | null;
  busy: boolean;
  onChoose: (variant: ClipVariant) => void;
  onDownload: () => void;
}) {
  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-2 gap-1 rounded-2xl bg-ink p-1" role="group" aria-label="Logo choice">
        <VariantButton
          label="With logo"
          hint="Stamped file"
          selected={variant === "logo"}
          disabled={!clip.withLogoUrl}
          onClick={() => onChoose("logo")}
        />
        <VariantButton
          label="Without logo"
          hint="Clean file"
          selected={variant === "clean"}
          disabled={!clip.withoutLogoUrl}
          onClick={() => onChoose("clean")}
        />
      </div>
      {!clip.withLogoUrl || !clip.withoutLogoUrl ? (
        <p className="text-xs text-muted">
          This post only has one video file
          {clip.withoutLogoUrl ? " — the clean one, without the logo." : " — the one with the logo still on it."}
        </p>
      ) : (
        <p className="text-xs text-muted">
          {variant === "clean"
            ? "Clean playback file. The moving TikTok logo is not burned in."
            : "The file TikTok stamps with its moving logo and username."}
        </p>
      )}
      <button
        type="button"
        disabled={!activeUrl || busy}
        onClick={onDownload}
        className="min-h-12 rounded-2xl bg-copper text-base font-semibold text-on-copper disabled:opacity-50"
      >
        {busy ? "Preparing file…" : variant === "clean" ? "Download without logo" : "Download with logo"}
      </button>
      {activeUrl ? (
        <video
          key={activeUrl}
          src={activeUrl}
          poster={clip.cover || undefined}
          controls
          playsInline
          preload="metadata"
          className="max-h-72 w-full rounded-2xl bg-ink object-contain"
        />
      ) : null}
    </div>
  );
}

function VariantButton({
  label,
  hint,
  selected,
  disabled,
  onClick,
}: {
  label: string;
  hint: string;
  selected: boolean;
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      aria-pressed={selected}
      onClick={onClick}
      className={
        selected
          ? "min-h-12 rounded-xl bg-copper px-2 text-on-copper disabled:opacity-40"
          : "min-h-12 rounded-xl px-2 text-fg disabled:opacity-40"
      }
    >
      <span className="block text-sm font-semibold">{label}</span>
      <span className={selected ? "block text-xs opacity-80" : "block text-xs text-muted"}>{hint}</span>
    </button>
  );
}

function PhotoSet({
  clip,
  busy,
  onSave,
}: {
  clip: Clip;
  busy: boolean;
  onSave: (url: string, index: number) => void;
}) {
  return (
    <div className="flex flex-col gap-3">
      <p className="text-xs text-muted">Photo post. These slides don’t carry the moving logo.</p>
      <div className={clip.images.length > 1 ? "grid grid-cols-2 gap-2" : "flex flex-col gap-2"}>
        {clip.images.map((image, index) => (
          <figure key={image} className="overflow-hidden rounded-2xl bg-ink">
            <img src={image} alt="" className="marq-photo w-full object-cover" />
            <button
              type="button"
              disabled={busy}
              onClick={() => onSave(image, index)}
              className="min-h-11 w-full text-sm font-medium text-fg disabled:opacity-50"
            >
              {clip.images.length > 1 ? `Save slide ${index + 1}` : "Download photo"}
            </button>
          </figure>
        ))}
      </div>
    </div>
  );
}
