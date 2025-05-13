import { LOCAL_STORAGE_KEY_SELECTED_UPLOAD } from "constants/application";
import {
  VisualProp,
  Visuals,
  UploadProp,
  VisualPosition,
  VisualSize,
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
  setVisualSize: (assetId: string, size: VisualSize) => void;
  setVisualPosition: (assetId: string, position: VisualPosition) => void;
};

export const useVisualStore = create<SelectedUploadState>()(
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
            Object.entries(state.Visuals).filter(([key]) => key !== assetId),
          ),
        })),

      clearVisual: () => set({ Visuals: {} }),

      getVisual: (assetId) => get().Visuals[assetId],

      // Need to keep track of size and position since konva does not accept html component as its child
      // set size
      setVisualSize: (assetId, size) =>
        set((state) => ({
          Visuals: {
            ...state.Visuals,
            [assetId]: {
              ...state.Visuals[assetId],
              size,
            },
          },
        })),

      // set position
      setVisualPosition: (assetId, position) =>
        set((state) => ({
          Visuals: {
            ...state.Visuals,
            [assetId]: {
              ...state.Visuals[assetId],
              position,
            },
          },
        })),
    }),
    {
      // For persists
      // zustand persists default to storing it in localstorage
      // name is local storage key
      name: LOCAL_STORAGE_KEY_SELECTED_UPLOAD,
    },
  ),
);
