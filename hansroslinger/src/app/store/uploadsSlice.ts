import { LOCAL_STORAGE_KEY_SELECTED_UPLOAD } from "constants/application";
import { UploadProp, Uploads } from "types/application";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type SelectedUploadState = {
  selectedUploads: Uploads;

  setSelectedUpload: (assetId: string, data: UploadProp) => void;
  removeSelectedUpload: (assetId: string) => void;
  clearSelectedUploads: () => void;
  getSelectedUpload: (assetId: string) => UploadProp | undefined;
};

export const useUploadStore = create<SelectedUploadState>()(
  persist(
    (set, get) => ({
      selectedUploads: {},

      setSelectedUpload: (assetId, data) =>
        set((state) => ({
          selectedUploads: {
            ...state.selectedUploads,
            [assetId]: data,
          },
        })),

      removeSelectedUpload: (assetId) =>
        set((state) => ({
          // use formEntries to change list of [assetId, uploadProp] into an object
          selectedUploads: Object.fromEntries(
            // .entries returns a list
            Object.entries(state.selectedUploads).filter(
              ([key]) => key !== assetId,
            ),
          ),
        })),

      clearSelectedUploads: () => set({ selectedUploads: {} }),

      getSelectedUpload: (assetId) => get().selectedUploads[assetId],
    }),
    {
      // For persists
      // zustand persists default to storing it in localstorage
      // name is local storage key
      name: LOCAL_STORAGE_KEY_SELECTED_UPLOAD,
    },
  ),
);
