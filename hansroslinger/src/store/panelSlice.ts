import { create } from "zustand";

type PanelState = {
  isOpen: boolean;
  toggle: () => void;
  setOpen: (value: boolean) => void;
};

export const usePanelStore = create<PanelState>((set) => ({
  isOpen: true,
  toggle: () => set((state) => ({ isOpen: !state.isOpen })),
  setOpen: (value) => set({ isOpen: value }),
}));
