import { LOCAL_STORAGE_KEY_SELECTED_UPLOAD } from "constants/application";
import {
  Visual,
  UploadProp,
  VisualPosition,
  VisualSize,
} from "types/application";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type VisualsState = {
  visuals: Visual[];
  pointerPosition: { x: number; y: number } | null;

  setPointerPosition: (position: { x: number; y: number } | null) => void;
  setVisual: (assetId: string, data: Visual) => void;
  addSelectedUpload: (assetId: string, uploadData: UploadProp) => void;
  removeVisual: (assetId: string) => void;
  clearVisual: () => void;
  getVisual: (assetId: string) => Visual | undefined;
  setVisualSize: (assetId: string, size: VisualSize) => void;
  setVisualPosition: (assetId: string, position: VisualPosition) => void;
  setVisualHover: (assetId: string, isHovered: boolean) => void;
  setUseOriginalSizeOnLoad: (
    assetId: string,
    useOriginalSizeOnLoad: boolean,
  ) => void;
};

export const useVisualStore = create<VisualsState>()(
  persist(
    (set, get) => ({
      visuals: [],
      pointerPosition: null,

      setPointerPosition: (position) => set({ pointerPosition: position }),

      setVisual: (assetId, data) =>
        set((state) => {
          const existingIndex = state.visuals.findIndex(
            (existingVisual) => existingVisual.assetId === assetId,
          );
          const updated = [...state.visuals];
          if (existingIndex >= 0) {
            updated[existingIndex] = data;
          } else {
            updated.push(data);
          }
          return { visuals: updated };
        }),

      addSelectedUpload: (assetId, uploadData) =>
        set((state) => {
          const alreadyExists = state.visuals.some(
            (existingVisual) => existingVisual.assetId === assetId,
          );
          if (alreadyExists) return { visuals: state.visuals };

          const visual: Visual = {
            assetId,
            uploadData,
            position: { x: 0, y: 0 },
            size: { width: 300, height: 200 },
            isHovered: false,
            useOriginalSizeOnLoad: true,
          };
          return { visuals: [...state.visuals, visual] };
        }),

      removeVisual: (assetId) =>
        set((state) => ({
          visuals: state.visuals.filter((v) => v.assetId !== assetId),
        })),

      clearVisual: () => set({ visuals: [] }),

      getVisual: (assetId) =>
        get().visuals.find((visual) => visual.assetId === assetId),

      setVisualSize: (assetId, size) =>
        set((state) => ({
          visuals: state.visuals.map((visual) =>
            visual.assetId === assetId ? { ...visual, size } : visual,
          ),
        })),

      setVisualPosition: (assetId, position) =>
        set((state) => ({
          visuals: state.visuals.map((visual) =>
            visual.assetId === assetId ? { ...visual, position } : visual,
          ),
        })),

      setVisualHover: (assetId, isHovered) =>
        set((state) => ({
          visuals: state.visuals.map((visual) =>
            visual.assetId === assetId ? { ...visual, isHovered } : visual,
          ),
        })),

      setUseOriginalSizeOnLoad: (assetId, useOriginalSizeOnLoad) =>
        set((state) => ({
          visuals: state.visuals.map((visual) =>
            visual.assetId === assetId
              ? { ...visual, useOriginalSizeOnLoad }
              : visual,
          ),
        })),
    }),
    {
      name: LOCAL_STORAGE_KEY_SELECTED_UPLOAD,
    },
  ),
);
