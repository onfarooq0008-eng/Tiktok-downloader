import { createFileRoute } from "@tanstack/react-router";
import { MarqApp } from "@/components/marq/app";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  return (
    <div className="studio">
      <aside className="studio-copy">
        <p className="text-xs font-medium tracking-widest text-copper uppercase">Phone app</p>
        <h1 className="font-display mt-3 text-6xl leading-none font-semibold">Marq</h1>
        <p className="mt-4 text-lg text-muted">
          Save a public TikTok. Keep the moving logo, or leave it off.
        </p>
        <ol className="mt-8 flex flex-col gap-3 text-sm text-fg">
          <li className="flex gap-3">
            <span className="font-medium text-copper">01</span>
            Paste a video or photo link.
          </li>
          <li className="flex gap-3">
            <span className="font-medium text-copper">02</span>
            Choose with logo or without.
          </li>
          <li className="flex gap-3">
            <span className="font-medium text-copper">03</span>
            Download the file, or just the sound.
          </li>
        </ol>
      </aside>
      <div className="phone">
        <MarqApp />
      </div>
    </div>
  );
}
