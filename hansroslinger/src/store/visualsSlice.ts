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

  setVisual: (assetId: string, data: Visual) => void;
  addSelectedUpload: (assetId: string, uploadData: UploadProp) => void;
  removeVisual: (assetId: string) => void;
  clearVisual: () => void;
  getVisual: (assetId: string) => Visual | undefined;
  setVisualSize: (assetId: string, size: VisualSize) => void;
  setVisualPosition: (assetId: string, position: VisualPosition) => void;
  setVisualHover: (assetId: string, isHovered: boolean) => void;
  setVisualDragging: (assetId: string, isDragging: boolean) => void;
  setUseOriginalSizeOnLoad: (
    assetId: string,
    useOriginalSizeOnLoad: boolean,
  ) => void;
};

export const useVisualStore = create<VisualsState>()(
  persist(
    (set, get) => ({
      visuals: [],

      setVisual: (assetId, data) =>
        set((state) => {
          const existingIndex = state.visuals.findIndex(
            (existingVisual) => existingVisual.assetId === assetId,
          );
          const updated = [...state.visuals];
          if (existingIndex >= 0) {
            // Update if visual already exists
            updated[existingIndex] = data;
          } else {
            // Add if not
            updated.push(data);
          }
          return { visuals: updated };
        }),

      addSelectedUpload: (assetId, uploadData) =>
        set((state) => {
          // Check if already exist, return original if true
          const alreadyExists = state.visuals.some(
            (existingVisual) => existingVisual.assetId === assetId,
          );
          if (alreadyExists) return { visuals: state.visuals };

          const visual: Visual = {
            assetId,
            uploadData,
            position: { x: 980, y: 0 }, // Test for top left of preview screen
            size: { width: 300, height: 200 },
            isHovered: false,
            isDragging: false,
            // When selected, should default to original size
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

      // Need to keep track of size and position since konva does not accept html component as its child
      // set size
      setVisualSize: (assetId, size) =>
        set((state) => ({
          visuals: state.visuals.map((visual) =>
            visual.assetId === assetId ? { ...visual, size } : visual,
          ),
        })),

      // set position
      setVisualPosition: (assetId, position) =>
        set((state) => ({
          visuals: state.visuals.map((visual) =>
            visual.assetId === assetId ? { ...visual, position } : visual,
          ),
        })),
      // set hover
      setVisualHover: (assetId, isHovered) =>
        set((state) => ({
          visuals: state.visuals.map((visual) =>
            visual.assetId === assetId ? { ...visual, isHovered } : visual,
          ),
        })),

      // set dragging
      setVisualDragging: (assetId, isDragging) =>
        set((state) => ({
          visuals: state.visuals.map((visual) =>
            visual.assetId === assetId ? { ...visual, isDragging } : visual,
          ),
        })),

      // To determine whether original size (obtained from image or json file) will be used for render or the stored size
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
      // For persists
      // zustand persists default to storing it in localstorage
      // name is local storage key
      name: LOCAL_STORAGE_KEY_SELECTED_UPLOAD,
    },
  ),
);
