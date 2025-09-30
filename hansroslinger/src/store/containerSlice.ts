import { create } from "zustand";

type CanvasState = {
  container: HTMLDivElement | null;
  setContainerEl: (el: HTMLDivElement | null) => void;
};

export const useContainerStore = create<CanvasState>((set) => ({
  container: null,
  setContainerEl: (el) => set({ container: el }),
}));

// non-hook access for utilities
export const containerStore = {
  getState: () => useContainerStore.getState(),
};
