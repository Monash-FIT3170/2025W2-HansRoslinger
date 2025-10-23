import { create } from "zustand";

type BackgroundState = {
  layerBehindPerson: boolean;
  setLayerBehindPerson: (layerBehindPerson: boolean) => void;
};

export const useBackgroundStore = create<BackgroundState>((set) => ({
  layerBehindPerson: false,
  setLayerBehindPerson: (layerBehindPerson) => set({ layerBehindPerson }),
}));
