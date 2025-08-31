// store/modeSlice.ts
import { create } from "zustand";

export type UIMode = "interact" | "paint";

type ModeState = {
  mode: UIMode;
  setMode: (m: UIMode) => void;
  toggleMode: () => void;
};

export const useModeStore = create<ModeState>((set, get) => ({
  mode: "interact",
  setMode: (m) => set({ mode: m }),
  toggleMode: () =>
    set({ mode: get().mode === "interact" ? "paint" : "interact" }),
}));
