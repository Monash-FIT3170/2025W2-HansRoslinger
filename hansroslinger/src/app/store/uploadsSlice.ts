import { UploadProp, Uploads } from "types/application";
import { create } from "zustand";

type SelectedUploadState = {
  uploads: Uploads;

  setSelectedUpload: (assetId: string, data: UploadProp) => void;
  removeSelectedUpload: (assetId: string) => void;
  clearSelectedUploads: () => void;
  getSelectedUpload: (assetId: string) => UploadProp | undefined;
};

export const useUploadStore = create<SelectedUploadState>((set, get) => ({
  uploads: {},

  setSelectedUpload: (assetId, data) =>
    set((state) => ({
      uploads: {
        ...state.uploads,
        [assetId]: data,
      },
    })),

  removeSelectedUpload: (assetId) =>
    set((state) => ({
      // use formEntries to change list of [assetId, uploadProp] into an object
      uploads: Object.fromEntries(
        // .entries returns a list
        Object.entries(state.uploads).filter(([key]) => key !== assetId)
      ),
    })),

  clearSelectedUploads: () => set({ uploads: {} }),

  getSelectedUpload: (assetId) => get().uploads[assetId],
}));