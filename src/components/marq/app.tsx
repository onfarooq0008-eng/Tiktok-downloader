import { useEffect, useState, type ReactNode } from "react";
import { BatteryFull, Bookmark, CircleHelp, Download, Signal, Wifi } from "lucide-react";
import { useShelf } from "@/lib/shelf";
import { MarqMark } from "@/components/marq/mark";
import { SaveScreen } from "@/components/marq/save-screen";
import { ShelfScreen } from "@/components/marq/shelf-screen";
import { AboutScreen } from "@/components/marq/about-screen";

type Tab = "save" | "shelf" | "about";

export function MarqApp() {
  const [tab, setTab] = useState<Tab>("save");
  const [hydrated, setHydrated] = useState(false);
  const [launch, setLaunch] = useState<string | null>(null);

  useEffect(() => {
    let live = true;
    void Promise.resolve(useShelf.persist.rehydrate()).then(() => {
      if (live) setHydrated(true);
    });
    return () => {
      live = false;
    };
  }, []);

  return (
    <div className="flex h-full min-h-0 flex-col bg-bg text-fg">
      <StatusBar />
      <div className="flex items-center gap-2 px-5 pt-1 pb-2">
        <MarqMark className="size-7 text-copper" />
        <span className="font-display text-2xl leading-none font-semibold tracking-tight">Marq</span>
      </div>
      <main className="min-h-0 flex-1 overflow-y-auto">
        {tab === "save" ? <SaveScreen launch={launch} /> : null}
        {tab === "shelf" ? (
          <ShelfScreen
            hydrated={hydrated}
            onOpen={(clip) => {
              setLaunch(`${Date.now()}|${clip.sourceUrl}`);
              setTab("save");
            }}
          />
        ) : null}
        {tab === "about" ? <AboutScreen /> : null}
      </main>
      <nav className="border-t border-line bg-bg px-3 pt-2 pb-2" aria-label="Primary">
        <div className="grid grid-cols-3">
          <TabButton label="Save" selected={tab === "save"} onClick={() => setTab("save")}>
            <Download className="size-5" />
          </TabButton>
          <TabButton label="Shelf" selected={tab === "shelf"} onClick={() => setTab("shelf")}>
            <Bookmark className="size-5" />
          </TabButton>
          <TabButton label="About" selected={tab === "about"} onClick={() => setTab("about")}>
            <CircleHelp className="size-5" />
          </TabButton>
        </div>
        <div className="mx-auto mt-2 mb-1 h-1 w-28 rounded-full bg-line" aria-hidden="true" />
      </nav>
    </div>
  );
}

function StatusBar() {
  const [label, setLabel] = useState("\u00a0");
  useEffect(() => {
    const tick = () => {
      setLabel(new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }));
    };
    tick();
    const id = window.setInterval(tick, 15000);
    return () => window.clearInterval(id);
  }, []);
  return (
    <div className="flex items-center justify-between px-5 pt-3 text-xs text-muted">
      <span className="font-medium text-fg">{label}</span>
      <span className="flex items-center gap-1.5" aria-hidden="true">
        <Signal className="size-3.5" />
        <Wifi className="size-3.5" />
        <BatteryFull className="size-4" />
      </span>
    </div>
  );
}

function TabButton({
  label,
  selected,
  onClick,
  children,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-current={selected ? "page" : undefined}
      className="flex min-h-12 flex-col items-center justify-center gap-0.5 text-xs font-medium"
    >
      <span
        className={
          selected
            ? "inline-flex h-8 w-16 items-center justify-center rounded-full bg-copper text-on-copper"
            : "inline-flex h-8 w-16 items-center justify-center text-muted"
        }
      >
        {children}
      </span>
      <span className={selected ? "text-fg" : "text-muted"}>{label}</span>
    </button>
  );
}
