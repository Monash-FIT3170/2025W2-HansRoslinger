"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import VegaLiteChartDisplay from "@/components/VegaLiteChartDisplay";
import { FILE_TYPE_PNG } from "constants/application";
import { Uploads } from "types/application";
import { useVisualStore } from "store/visualsSlice";
import { useCollectionsStore } from "store/collectionsSlice";

type CollectionsModalProps = {
  uploads: Uploads;
  isOpen: boolean;
  onClose: () => void;
};

export default function CollectionsModal({ uploads, isOpen, onClose }: CollectionsModalProps) {
  const selectedVisuals = useVisualStore((s) => s.visuals);
  const selectedIds = useMemo(() => selectedVisuals.map((v) => v.assetId), [selectedVisuals]);

  const collections = useCollectionsStore((s) => s.collections);
  const upsertCollection = useCollectionsStore((s) => s.upsertCollection);
  const addAssetsToCollection = useCollectionsStore((s) => s.addAssetsToCollection);

  const [activeTab, setActiveTab] = useState<"existing" | "new">("existing");
  const [newCollectionName, setNewCollectionName] = useState("");
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [selectedCollectionName, setSelectedCollectionName] = useState<string>("");
  const carouselRef = useRef<HTMLDivElement | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (!isOpen) return;
    // Default check currently selected visuals
    const initial: Record<string, boolean> = {};
    selectedIds.forEach((id) => (initial[id] = true));
    setChecked(initial);
  }, [isOpen, selectedIds]);

  // When a collection is selected in the Existing tab, pre-select its assets
  useEffect(() => {
    if (!isOpen) return;
    if (activeTab !== "existing") return;
    if (!selectedCollectionName) return;
    const collection = collections[selectedCollectionName];
    if (!collection) return;
    const next: Record<string, boolean> = {};
    // Only check assets that exist in current uploads list
    collection.assetIds.forEach((id) => {
      if (uploads[id]) next[id] = true;
    });
    setChecked(next);
  }, [isOpen, activeTab, selectedCollectionName, collections, uploads]);

  if (!isOpen) return null;

  const assetEntries = Object.entries(uploads);

  const chosenAssetIds = assetEntries
    .filter(([id]) => checked[id])
    .map(([id]) => id);

  const handleToggle = (id: string) => setChecked((prev) => ({ ...prev, [id]: !prev[id] }));

  const goToIndex = (nextIndex: number) => {
    const container = carouselRef.current;
    if (!container) return;
    const clamped = Math.max(0, Math.min(assetEntries.length - 1, nextIndex));
    setActiveIndex(clamped);
    const target = container.children[clamped] as HTMLElement | undefined;
    if (target) {
      target.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    }
  };

  const onArrowLeft = () => {
    goToIndex(activeIndex - 1);
  };

  const onArrowRight = () => {
    goToIndex(activeIndex + 1);
  };

  const handleCarouselScroll = (e: React.WheelEvent<HTMLDivElement>) => {
    // Stop scroll events from bubbling up to the modal
    e.stopPropagation();
    
    const container = carouselRef.current;
    if (!container) return;
    
    // Convert vertical scroll to horizontal scroll
    if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
      e.preventDefault();
      container.scrollLeft += e.deltaY;
    }
  };

  const getThumbSrc = (src?: string) => {
    if (src && src.length > 0) return src;
    return "/uploads/default-thumbnail.png";
  };

  const handleSaveToExisting = () => {
    if (!selectedCollectionName) return;
    addAssetsToCollection(selectedCollectionName, chosenAssetIds);
    onClose();
  };

  const handleCreateNew = () => {
    const name = newCollectionName.trim();
    if (!name) return;
    upsertCollection(name);
    addAssetsToCollection(name, chosenAssetIds);
    setNewCollectionName("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-black/5 flex flex-col">
        <div className="flex items-start gap-3 px-6 py-4 flex-shrink-0 bg-[#fffcee]">
          <Image
            src="/yubi-logo.png"
            alt="Yubi Logo"
            width={65}
            height={65}
            className="h-15 object-contain"
          />
          <div className="flex-1">
            <h3 className="text-lg font-semibold">Collections</h3>
            <p className="text-sm text-gray-500">Group uploads into reusable sets</p>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-800 transition-colors"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className="flex flex-col flex-1 min-h-0">
          {/* Fixed header section */}
          <div className="px-6 py-5 flex-shrink-0">
            <div className="flex w-full justify-center">
              <div className="inline-flex items-center gap-1 rounded-full bg-gray-100 p-1">
                <button
                  className={`${
                    activeTab === "existing" ? "bg-white shadow" : "bg-transparent"
                  } rounded-full px-4 py-1.5 text-sm font-medium transition-colors`}
                  onClick={() => setActiveTab("existing")}
                >
                  Existing
                </button>
                <button
                  className={`${
                    activeTab === "new" ? "bg-white shadow" : "bg-transparent"
                  } rounded-full px-4 py-1.5 text-sm font-medium transition-colors`}
                  onClick={() => setActiveTab("new")}
                >
                  New
                </button>
              </div>
            </div>

            <div className="mt-6">
              <div className="space-y-4">
                {activeTab === "existing" ? (
                  <div className="space-y-3">
                    <div className="text-sm font-semibold text-gray-700">Choose existing collection</div>
                    <select
                      className="w-full rounded-lg border border-gray-300 bg-white p-2.5 text-sm outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-500/30"
                      value={selectedCollectionName}
                      onChange={(e) => {
                        const val = e.target.value;
                        setSelectedCollectionName(val);
                        if (val === "") {
                          setChecked({});
                        }
                      }}
                    >
                      <option value="">- Select -</option>
                      {Object.keys(collections).map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={handleSaveToExisting}
                      disabled={!selectedCollectionName || chosenAssetIds.length === 0}
                      className="w-full rounded-lg bg-gradient-to-r from-teal-500 to-emerald-500 px-4 py-2 text-white transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Add to collection
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="text-sm font-semibold text-gray-700">Create new collection</div>
                    <input
                      value={newCollectionName}
                      onChange={(e) => setNewCollectionName(e.target.value)}
                      className="w-full rounded-lg border border-gray-300 bg-white p-2.5 text-sm outline-none transition placeholder:text-gray-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/30"
                      placeholder="Collection name"
                    />
                    <button
                      onClick={handleCreateNew}
                      disabled={!newCollectionName.trim() || chosenAssetIds.length === 0}
                      className="w-full rounded-lg bg-gradient-to-r from-teal-500 to-emerald-500 px-4 py-2 text-white transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Create and add
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Fixed controls section */}
            <div className="mt-6 space-y-3">
              <div className="flex items-center justify-between">
                <div className="text-sm font-semibold text-gray-700">Select uploads</div>
                <div className="text-xs text-gray-500">{chosenAssetIds.length} selected</div>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <button
                  className="rounded-md px-2 py-1 hover:bg-gray-100"
                  onClick={() => {
                    const all: Record<string, boolean> = {};
                    assetEntries.forEach(([id]) => (all[id] = true));
                    setChecked(all);
                  }}
                >
                  Select all
                </button>
                <button
                  className="rounded-md px-2 py-1 hover:bg-gray-100"
                  onClick={() => setChecked({})}
                >
                  Clear
                </button>
              </div>
            </div>
          </div>

          {/* Scrollable carousel section */}
          <div className="flex-1 min-h-0 px-6 pb-5">
            <div className="relative h-full">
              <div className="absolute left-0 top-1/2 -translate-y-1/2 z-20 pointer-events-none">
                <button
                  onClick={onArrowLeft}
                  className="rounded-full bg-white/90 shadow ring-1 ring-gray-200 p-2 hover:bg-white pointer-events-auto"
                  aria-label="Previous"
                >
                  ◀
                </button>
              </div>
              <div className="absolute right-0 top-1/2 -translate-y-1/2 z-20 pointer-events-none">
                <button
                  onClick={onArrowRight}
                  className="rounded-full bg-white/90 shadow ring-1 ring-gray-200 p-2 hover:bg-white pointer-events-auto"
                  aria-label="Next"
                >
                  ▶
                </button>
              </div>
              <div
                ref={carouselRef}
                onWheel={handleCarouselScroll}
                className="h-full flex gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory px-8 py-2 no-scrollbar overscroll-contain"
              >
                {assetEntries.map(([id, data]) => {
                  const selected = !!checked[id];
                  return (
                    <div
                      key={id}
                      className="snap-center shrink-0 select-none"
                    >
                      <div
                        role="button"
                        onClick={() => handleToggle(id)}
                        className={`relative min-w-[180px] h-52 bg-white shadow-md rounded-md flex flex-col items-center justify-center p-3 text-center cursor-pointer hover:-translate-y-1 hover:shadow-lg transition ${
                          selected ? "border-4 border-green-500" : ""
                        }`}
                      >

                        <div className="relative w-24 h-24 m-3 flex items-center justify-center">
                          {data.type === FILE_TYPE_PNG ? (
                            <Image
                              src={getThumbSrc(data.thumbnailSrc)}
                              alt={data.name}
                              className="object-contain object-center"
                              fill={true}
                              sizes="max-width: 24px"
                            />
                          ) : (
                            <VegaLiteChartDisplay data={data} />
                          )}
                        </div>
                        <div className="font-semibold text-base truncate max-w-[150px]">{data.name}</div>
                        <div className="text-sm text-gray-500">{data.type}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


