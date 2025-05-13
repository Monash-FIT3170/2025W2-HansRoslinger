import { LOCAL_STORAGE_KEY_SELECTED_UPLOAD } from "constants/application";
import {
  VisualProp,
  Visuals,
  UploadProp,
} from "types/application";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type SelectedUploadState = {
  Visuals: Visuals;

  setVisual: (assetId: string, data: VisualProp) => void;
  addSelectedUpload: (assetId: string, uploadData: UploadProp) => void;
  removeVisual: (assetId: string) => void;
  clearVisual: () => void;
  getVisual: (assetId: string) => VisualProp | undefined;
};

export const useUploadStore = create<SelectedUploadState>()(
  persist(
    (set, get) => ({
      Visuals: {},

      setVisual: (assetId, data) =>
        set((state) => ({
          Visuals: {
            ...state.Visuals,
            [assetId]: data,
          },
        })),
      addSelectedUpload: (assetId, uploadData) =>
        set((state) => {
          const visual: VisualProp = {
            uploadData,
            position: { x: 0, y: 0 },
            size: { width: 300, height: 200 },
          };

          return {
            Visuals: {
              ...state.Visuals,
              [assetId]: visual,
            },
          };
        }),

      removeVisual: (assetId) =>
        set((state) => ({
          // use formEntries to change list of [assetId, SelectedVisualProp] into an object
          Visuals: Object.fromEntries(
            // .entries returns a list
            Object.entries(state.Visuals).filter(
              ([key]) => key !== assetId,
            ),
          ),
        })),

      clearVisual: () => set({ Visuals: {} }),

      getVisual: (assetId) => get().Visuals[assetId],
    }),
    {
      // For persists
      // zustand persists default to storing it in localstorage
      // name is local storage key
      name: LOCAL_STORAGE_KEY_SELECTED_UPLOAD,
    },
  ),
);
