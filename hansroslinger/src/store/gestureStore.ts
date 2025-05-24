import { HandGesture } from "types/application";
import { create } from "zustand";

type GestureStore = {
  previousGesture: HandGesture | null;
  currentGesture: HandGesture | null;
  setGesture: (gesture: HandGesture) => void;
  clearGesture: () => void;
};

export const useGestureStore = create<GestureStore>((set) => ({
  previousGesture: null,
  currentGesture: null,
  setGesture: (gesture) => set({ currentGesture: gesture }),
  clearGesture: () => set({ currentGesture: null }),
}));