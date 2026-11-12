import { useShelf } from "@/lib/shelf";

export function AboutScreen() {
  const clear = useShelf((state) => state.clear);
  const count = useShelf((state) => state.items.length);

  return (
    <div className="flex flex-col gap-5 px-5 pt-2 pb-8">
      <header>
        <p className="text-xs font-medium tracking-widest text-copper uppercase">About</p>
        <h1 className="font-display mt-1 text-4xl leading-none font-semibold">How Marq saves</h1>
      </header>
      <ol className="flex flex-col gap-3 text-sm">
        <li className="rounded-2xl bg-surface px-4 py-3">
          <span className="font-medium text-copper">1 · Paste</span>
          <p className="mt-1 text-muted">A public video or photo link from TikTok, including short vm.tiktok.com links.</p>
        </li>
        <li className="rounded-2xl bg-surface px-4 py-3">
          <span className="font-medium text-copper">2 · Choose</span>
          <p className="mt-1 text-muted">
            With logo keeps the moving TikTok mark. Without logo uses the clean playback file when the post has one.
          </p>
        </li>
        <li className="rounded-2xl bg-surface px-4 py-3">
          <span className="font-medium text-copper">3 · Download</span>
          <p className="mt-1 text-muted">The file saves to your phone. Sound is separate, when the post has a track.</p>
        </li>
      </ol>
      <p className="text-sm text-muted">
        Photo posts come through as slides, not a logo choice. Lives, private posts, and friends-only posts can’t be fetched.
      </p>
      <p className="text-sm text-muted">
        Your shelf stays in this browser only. Links expire, so opening an old row fetches the post again.
      </p>
      <button
        type="button"
        disabled={count === 0}
        onClick={() => clear()}
        className="min-h-12 rounded-2xl bg-raised text-sm font-medium text-fg disabled:opacity-40"
      >
        Clear shelf{count > 0 ? ` · ${count}` : ""}
      </button>
    </div>
  );
}
