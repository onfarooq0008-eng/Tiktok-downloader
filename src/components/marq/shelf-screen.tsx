import { Trash2 } from "lucide-react";
import { ago, type Clip } from "@/lib/clip";
import { useShelf } from "@/lib/shelf";

export function ShelfScreen({
  hydrated,
  onOpen,
}: {
  hydrated: boolean;
  onOpen: (clip: Clip) => void;
}) {
  const items = useShelf((state) => state.items);
  const remove = useShelf((state) => state.remove);
  const shown = hydrated ? items : [];

  return (
    <div className="flex flex-col gap-4 px-5 pt-2 pb-8">
      <header>
        <p className="text-xs font-medium tracking-widest text-copper uppercase">Shelf</p>
        <h1 className="font-display mt-1 text-4xl leading-none font-semibold">Recent posts</h1>
      </header>
      {shown.length === 0 ? (
        <p className="text-sm text-muted">
          Nothing here yet. Fetch a link on Save and it stays on this device, ready to download again.
        </p>
      ) : (
        <ul className="flex flex-col gap-2">
          {shown.map((clip) => (
            <li key={clip.id} className="flex items-stretch gap-2">
              <button
                type="button"
                onClick={() => onOpen(clip)}
                className="flex min-h-16 min-w-0 flex-1 gap-3 rounded-2xl bg-surface p-2 text-left"
              >
                {clip.cover ? (
                  <img src={clip.cover} alt="" className="h-16 w-12 rounded-xl object-cover" />
                ) : (
                  <span className="h-16 w-12 rounded-xl bg-raised" />
                )}
                <span className="min-w-0 py-1">
                  <span className="line-clamp-2 block text-sm font-medium">{clip.title}</span>
                  <span className="mt-1 block text-xs text-muted">
                    @{clip.authorHandle} · {ago(clip.fetchedAt)}
                  </span>
                </span>
              </button>
              <button
                type="button"
                aria-label={`Remove ${clip.authorHandle}`}
                onClick={() => remove(clip.id)}
                className="inline-flex w-12 items-center justify-center rounded-2xl bg-surface text-muted"
              >
                <Trash2 className="size-4" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
