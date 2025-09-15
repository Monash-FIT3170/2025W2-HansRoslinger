import { create } from "zustand";

type CanvasState = {
  gestureCanvas: HTMLCanvasElement | null;
  setCanvasEl: (el: HTMLCanvasElement | null) => void;
};

export const useCanvasStore = create<CanvasState>((set) => ({
  gestureCanvas: null,
  setCanvasEl: (el) => set({ gestureCanvas: el }),
}));

// optional non-hook access for utilities
export const canvasStore = {
  getState: () => useCanvasStore.getState(),
};
