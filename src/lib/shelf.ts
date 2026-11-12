import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Clip, ClipVariant } from "@/lib/clip";

type ShelfState = {
  items: Clip[];
  prefer: ClipVariant;
  remember: (clip: Clip) => void;
  remove: (id: string) => void;
  clear: () => void;
  setPrefer: (prefer: ClipVariant) => void;
};

export const useShelf = create<ShelfState>()(
  persist(
    (set) => ({
      items: [],
      prefer: "clean",
      remember: (clip) =>
        set((state) => ({
          items: [clip, ...state.items.filter((item) => item.id !== clip.id)].slice(0, 30),
        })),
      remove: (id) => set((state) => ({ items: state.items.filter((item) => item.id !== id) })),
      clear: () => set({ items: [] }),
      setPrefer: (prefer) => set({ prefer }),
    }),
    { name: "marq-shelf", skipHydration: true },
  ),
);
