import { GesturePayload } from "app/detection/Gesture";
import { create } from "zustand";

type GestureStore = {
  gesturePayloads: GesturePayload[];
  setGesturePayloads: (gesture: GesturePayload[]) => void;
  clearGesturePayloads: () => void;
};

export const useGestureStore = create<GestureStore>((set) => ({
  gesturePayloads: [],
  setGesturePayloads: (gesture) => set({ gesturePayloads: gesture }),
  clearGesturePayloads: () => set({ gesturePayloads: [] }),
}));
