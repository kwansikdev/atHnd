// store/ui-store.ts
import { create } from "zustand";

type UIState = {
  openMap: Record<string, boolean>;
  open: (id: string) => void;
  close: (id: string) => void;
  toggle: (id: string) => void;
};

export const useUIStore = create<UIState>((set) => ({
  openMap: {},
  open: (id) => set((s) => ({ openMap: { ...s.openMap, [id]: true } })),
  close: (id) => set((s) => ({ openMap: { ...s.openMap, [id]: false } })),
  toggle: (id) =>
    set((s) => ({ openMap: { ...s.openMap, [id]: !s.openMap[id] } })),
}));
