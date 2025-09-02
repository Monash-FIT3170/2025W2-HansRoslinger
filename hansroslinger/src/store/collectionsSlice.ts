import { LOCAL_STORAGE_KEY_COLLECTIONS } from "constants/application";
import { Collections } from "types/application";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type CollectionsState = {
  collections: Collections;
  upsertCollection: (name: string) => void;
  addAssetsToCollection: (name: string, assetIds: string[]) => void;
  removeAssetFromCollection: (name: string, assetId: string) => void;
};

export const useCollectionsStore = create<CollectionsState>()(
  persist(
    (set, get) => ({
      collections: {},

      upsertCollection: (name) =>
        set((state) => {
          if (state.collections[name]) return state;
          return {
            collections: {
              ...state.collections,
              [name]: { name, assetIds: [] },
            },
          };
        }),

      addAssetsToCollection: (name, assetIds) =>
        set((state) => {
          const existing = state.collections[name] ?? { name, assetIds: [] };
          const merged = Array.from(new Set([...existing.assetIds, ...assetIds]));
          return {
            collections: { ...state.collections, [name]: { name, assetIds: merged } },
          };
        }),

      removeAssetFromCollection: (name, assetId) =>
        set((state) => {
          const existing = state.collections[name];
          if (!existing) return state;
          return {
            collections: {
              ...state.collections,
              [name]: { ...existing, assetIds: existing.assetIds.filter((id) => id !== assetId) },
            },
          };
        }),
    }),
    { name: LOCAL_STORAGE_KEY_COLLECTIONS },
  ),
);


