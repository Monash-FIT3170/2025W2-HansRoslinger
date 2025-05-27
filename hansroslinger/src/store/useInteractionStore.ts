import { create } from "zustand";

interface InteractionState {
  pointer: { x: number; y: number } | null;
  setPointer: (position: { x: number; y: number }) => void;
}

export const useInteractionStore = create<InteractionState>((set) => ({
  pointer: null,
  setPointer: (position) => set({ pointer: position }),
}));
