/**
 * FloatingDataPanel.tsx
 *
 * This component renders a floating side panel that displays uploaded visuals (images or charts).
 * - It uses Zustand stores (`usePanelStore`, `useVisualStore`) to manage open/close state and selected visuals.
 * - The panel shows a grid of "uploads" from starred collections, which can be toggled (added/removed) when clicked.
 * - Each visual is displayed as either an image thumbnail (for PNGs) or a VegaLite chart.
 * - A toggle button is always visible on the left side of the screen to open/close the panel.
 *
 * Key responsibilities:
 * - Display uploaded visuals from starred collections in a scrollable, interactive grid.
 * - Allow users to select/deselect visuals via click.
 * - Manage UI feedback (highlighting selected/hovered visuals).
 * - Provide a collapsible panel UI that overlays the page.
 */
"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { usePanelStore } from "store/panelSlice";
import { useVisualStore } from "store/visualsSlice";
import { FILE_TYPE_PNG } from "constants/application";
import VegaLiteChartDisplay from "@/components/VegaLiteChartDisplay";
import { Uploads } from "types/application";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Helper for hovering using gesture
// Not ideal implementation
// TODO: Improve hovering by gesture
function useHover() {
  const [isHovered, setIsHovered] = useState(false);
  const onMouseEnter = () => setIsHovered(true);
  const onMouseLeave = () => setIsHovered(false);
  return { isHovered, onMouseEnter, onMouseLeave };
}

// Panel store state
const FloatingDataPanel = () => {
  // Hover state for clickable
  const refreshHover = useHover();
  const closeHover = useHover();
  const collectionsTabHover = useHover();
  const assetsTabHover = useHover();
  const toggleHover = useHover();
  const [hoveredAssetId, setHoveredAssetId] = useState<string | null>(null);

  const isOpen = usePanelStore((state) => state.isOpen); //whether panel open or not
  const toggle = usePanelStore((state) => state.toggle); //to toggle panel open and close

  // Visuals store state
  const addSelectedUpload = useVisualStore((state) => state.addSelectedUpload); //add visual to selection
  const removeSelectedUpload = useVisualStore((state) => state.removeVisual); //remove visual from selection
  const visuals = useVisualStore((state) => state.visuals); //currently selected visuals

  // State for uploads from starred collections
  const [uploads, setUploads] = useState<Uploads>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [starredCollections, setStarredCollections] = useState<
    Array<{ id: string; name: string }>
  >([]);
  const [collectionFilter, setCollectionFilter] = useState<string>("__all__");
  const [sourceMode, setSourceMode] = useState<"collections" | "assets">(
    "collections"
  );

  // Fetch starred collections and their assets
  const fetchStarredCollectionAssets = useCallback(
    async (filterName?: string) => {
      try {
        setIsLoading(true);
        setError(null);

        // If viewing raw assets (no collections), use user-files endpoint
        if (sourceMode === "assets") {
          const res = await fetch("/api/user-files", {
            method: "GET",
            credentials: "include",
          });
          if (!res.ok) {
            throw new Error("Failed to fetch assets");
          }
          const data = await res.json();
          setUploads(data.uploads || {});
          return;
        }

        // Otherwise, fetch starred/selected collections
        const collectionsRes = await fetch("/api/collection-getSelected", {
          method: "GET",
          credentials: "include",
        });

        if (!collectionsRes.ok) {
          throw new Error("Failed to fetch selected collections");
        }

        const collectionsData = await collectionsRes.json();
        const selectedCollections = collectionsData.collections || [];
        // Update local state for dropdown options
        setStarredCollections(
          selectedCollections.map((c: { id: number; name: string }) => ({
            id: String(c.id),
            name: c.name,
          }))
        );

        const activeFilter =
          typeof filterName === "string" ? filterName : collectionFilter;

        // Fetch assets for each selected collection
        const allUploads: Uploads = {};

        const collectionsToFetch =
          activeFilter && activeFilter !== "__all__"
            ? selectedCollections.filter(
                (c: { name: string }) => c.name === activeFilter
              )
            : selectedCollections;

        for (const collection of collectionsToFetch) {
          try {
            const assetsRes = await fetch(
              `/api/assets-getAll?collection=${encodeURIComponent(collection.name)}`,
              {
                method: "GET",
                credentials: "include",
              }
            );

            if (assetsRes.ok) {
              const assetsData = await assetsRes.json();
              if (assetsData.success && assetsData.uploads) {
                // Merge uploads from this collection
                Object.assign(allUploads, assetsData.uploads);
              }
            }
          } catch (err) {
            console.error(
              `Error fetching assets for collection ${collection.name}:`,
              err
            );
          }
        }

        setUploads(allUploads);
      } catch (err) {
        console.error("Error fetching starred collection assets:", err);
        setError(err instanceof Error ? err.message : "Failed to load assets");
      } finally {
        setIsLoading(false);
      }
    },
    [collectionFilter, sourceMode]
  );

  useEffect(() => {
    fetchStarredCollectionAssets();
  }, [fetchStarredCollectionAssets]);

  //Function to check if a visual is already selected
  //Input: assetId, ID of asset
  const isVisualSelected = (assetId: string) => {
    return visuals.some((visual) => visual.assetId === assetId);
  };

  //Function to Handle user clicking on a visual tile
  // Input: assetId, ID of asset
  const handleClick = (assetId: string) => {
    const uploadData = uploads[assetId];
    if (!uploadData) return;
    if (isVisualSelected(assetId)) {
      // If already selected, remove it
      removeSelectedUpload(assetId);
    } else {
      // If not, add it
      addSelectedUpload(assetId, uploadData);
    }
  };

  return (
    <>
      {/* Panel */}
      {isOpen && (
        <div className="absolute top-0 left-0 bottom-0 z-40 h-full w-1/3 overflow-y-auto glass bg-white/75 border-r border-[rgba(229,161,104,0.35)] shadow-2xl flex flex-col text-[#1f2937] scrollbar-thin">
          {/* Header */}
          <div className="sticky top-0 z-10 bg-white/80 backdrop-blur px-6 pt-4 pb-3 border-b border-[rgba(229,161,104,0.25)]">
            <div className="relative text-center">
              <div className="absolute inset-x-0 -top-[1px] h-1 bg-gradient-to-r from-[#5C9BB8] via-[#FC9770] to-[#FBC841]"></div>
              <button
                onClick={() => fetchStarredCollectionAssets()}
                onMouseEnter={refreshHover.onMouseEnter}
                onMouseLeave={refreshHover.onMouseLeave}
                aria-label="Refresh collections"
                className={`absolute left-0 top-1/2 -translate-y-1/2 text-[#5C9BB8] p-1 rounded transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed
                  hover:text-[#4a89a6] hover:bg-[#5C9BB8]/10
                  ${refreshHover.isHovered ? "text-[#4a89a6] bg-[#5C9BB8]/10" : ""}`}
                disabled={isLoading}
                title="Refresh starred collections"
              >
                <svg
                  className={`w-5 h-5 transition-transform duration-300 ${
                    isLoading
                      ? "animate-spin"
                      : refreshHover.isHovered
                        ? "rotate-180"
                        : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
              </button>
              <h2 className="text-lg font-bold tracking-wide">Live Preview</h2>

              <button
                onClick={toggle}
                onMouseEnter={closeHover.onMouseEnter}
                onMouseLeave={closeHover.onMouseLeave}
                aria-label="Close uploads panel"
                className={`absolute right-0 top-1/2 -translate-y-1/2 text-[#4b5563] px-2
                  hover:text-[#111827]
                  ${closeHover.isHovered ? "text-[#111827]" : ""}`}
              >
                <span
                  className={`inline-block transition-transform duration-200 ${
                    closeHover.isHovered ? "scale-110" : ""
                  }`}
                >
                  ×
                </span>
              </button>
            </div>
            {/* Source mode + collection filter */}
            <div className="mt-3 flex items-center justify-between gap-3">
              <div className="inline-flex rounded border border-[#5C9BB8]/30 overflow-hidden">
                <button
                  className={`px-3 py-1.5 text-xs font-semibold ${
                    sourceMode === "collections"
                      ? "bg-[#5C9BB8]/15 text-[#1f2937]"
                      : "bg-white/90"
                  }`}
                  onClick={() => {
                    setSourceMode("collections");
                    fetchStarredCollectionAssets();
                  }}
                  onMouseEnter={collectionsTabHover.onMouseEnter}
                  onMouseLeave={collectionsTabHover.onMouseLeave}
                >
                  <span
                    className={`inline-block transition-transform duration-200 ${
                      collectionsTabHover.isHovered ? "-translate-y-0.5" : ""
                    }`}
                  >
                    Collections
                  </span>
                </button>
                <button
                  className={`px-3 py-1.5 text-xs font-semibold border-l border-[#5C9BB8]/30 ${
                    sourceMode === "assets"
                      ? "bg-[#5C9BB8]/15 text-[#1f2937]"
                      : "bg-white/90"
                  }`}
                  onClick={() => {
                    setSourceMode("assets");
                    fetchStarredCollectionAssets();
                  }}
                  onMouseEnter={assetsTabHover.onMouseEnter}
                  onMouseLeave={assetsTabHover.onMouseLeave}
                >
                  <span
                    className={`inline-block transition-transform duration-200 ${
                      assetsTabHover.isHovered ? "-translate-y-0.5" : ""
                    }`}
                  >
                    Assets
                  </span>
                </button>
              </div>

              {sourceMode === "collections" && (
                <select
                  value={collectionFilter}
                  onChange={(e) => {
                    const value = e.target.value;
                    setCollectionFilter(value);
                    fetchStarredCollectionAssets(value);
                  }}
                  className="ml-auto px-3 py-1.5 border border-[#5C9BB8]/30 bg-white/90 focus:outline-none focus:ring-2 focus:ring-[#5C9BB8]/40 focus:border-transparent text-sm font-semibold"
                >
                  <option value="__all__">All starred</option>
                  {starredCollections.map((c) => (
                    <option key={c.id} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>

          {/* Visuals section */}
          <div className="flex-1 overflow-y-auto px-6 py-4">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-12 space-y-4">
                <div className="w-12 h-12 border-4 border-[#5C9BB8] border-t-transparent rounded-full animate-spin"></div>
                <p className="text-[#4a4a4a] text-sm font-medium">
                  Loading starred collections...
                </p>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center py-12 space-y-3">
                <svg
                  className="w-16 h-16 text-[#FC9770]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <p className="text-[#FC9770] text-sm font-medium">{error}</p>
              </div>
            ) : Object.keys(uploads).length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 space-y-3">
                <svg
                  className="w-16 h-16 text-[#5C9BB8]/50"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                  />
                </svg>
                <p className="text-[#4a4a4a] text-sm font-medium text-center px-4">
                  No assets found in starred collections
                </p>
                <p className="text-[#4a4a4a]/70 text-xs text-center px-4">
                  Star a collection to see its assets here
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {Object.entries(uploads).map(([assetId, uploadData], idx) => {
                  //check if visual currently hovered for highlighting
                  const isSelected = isVisualSelected(assetId);
                  const isTileHovered = hoveredAssetId === assetId;

                  return (
                    <div
                      key={assetId}
                      data-asset-id={assetId}
                      onClick={() => handleClick(assetId)}
                      onMouseEnter={() => setHoveredAssetId(assetId)}
                      onMouseLeave={() => setHoveredAssetId(null)}
                      className={`group relative backdrop-blur-md transition-all duration-500 cursor-pointer p-4 animate-scale-in ${
                        isSelected
                          ? "bg-white/95 shadow-2xl shadow-[#5C9BB8]/40 ring-2 ring-[#5C9BB8] scale-[1.02] -translate-y-1"
                          : "bg-white/80 shadow-lg hover:shadow-2xl hover:bg-white/95 hover:-translate-y-1 hover:ring-2 hover:ring-[#FC9770]/40"
                      } ${
                        !isSelected && isTileHovered
                          ? "shadow-2xl bg-white/95 -translate-y-1 ring-2 ring-[#FC9770]/40"
                          : ""
                      }`}
                      style={{ animationDelay: `${idx * 80}ms` }}
                    >
                      {/* Gradient border accent on top */}
                      <div
                        className={`absolute top-0 left-0 right-0 h-1 transition-all duration-500 ${
                          isSelected
                            ? "bg-gradient-to-r from-[#5C9BB8] via-[#FC9770] to-[#FBC841] opacity-100"
                            : "bg-gradient-to-r from-[#FC9770]/40 to-[#FBC841]/40 opacity-0 group-hover:opacity-100"
                        } ${!isSelected && isTileHovered ? "opacity-100" : ""}`}
                      ></div>

                      <div className="flex items-center gap-4">
                        {/* === THUMBNAIL / PREVIEW === */}
                        <div
                          className={`relative w-24 h-24 border bg-white flex items-center justify-center overflow-hidden shrink-0 transition-all duration-300 ${
                            isSelected
                              ? "border-[#5C9BB8] shadow-md"
                              : "border-gray-200 group-hover:border-[#FC9770]/50"
                          } ${!isSelected && isTileHovered ? "border-[#FC9770]/50" : ""}`}
                        >
                          {/* Render image if it's a PNG, otherwise render VegaLite chart */}
                          {uploadData.type === FILE_TYPE_PNG ? (
                            <Image
                              src={
                                uploadData.thumbnailSrc ||
                                "/uploads/default-thumbnail.png"
                              }
                              alt={uploadData.name}
                              className="max-w-[85%] max-h-[85%] object-contain"
                              width={80}
                              height={80}
                            />
                          ) : (
                            <div className="w-full h-full scale-75">
                              <VegaLiteChartDisplay data={uploadData} />
                            </div>
                          )}
                        </div>

                        {/* === LABELS === */}
                        <div className="flex-1 min-w-0">
                          <p className="text-base font-semibold text-[#2a2a2a] truncate mb-1.5">
                            {uploadData.name}
                          </p>
                          <span className="inline-block text-[10px] uppercase tracking-wider text-[#5C9BB8] bg-[#5C9BB8]/10 px-2 py-0.5 font-medium">
                            {uploadData.type}
                          </span>
                        </div>

                        {/* Selection indicator */}
                        {isSelected && (
                          <div className="shrink-0 w-8 h-8 bg-gradient-to-br from-[#5C9BB8] to-[#4a89a6] rounded-full flex items-center justify-center shadow-lg animate-scale-in">
                            <svg
                              className="w-5 h-5 text-white"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={3}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          </div>
                        )}
                      </div>

                      {/* Hover glow effect */}
                      {!isSelected && (
                        <div className="absolute inset-0 bg-gradient-to-r from-[#FC9770]/5 to-[#FBC841]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* toggle button */}
      <button
        onClick={toggle}
        onMouseEnter={toggleHover.onMouseEnter}
        onMouseLeave={toggleHover.onMouseLeave}
        aria-label={isOpen ? "Collapse uploads panel" : "Expand uploads panel"}
        className={`absolute -translate-y-1/2 z-50 w-14 h-28 bg-gradient-to-b from-[#5C9BB8] to-[#FC9770] text-white rounded-r shadow-xl flex items-center justify-center text-base font-bold top-1/2
          hover:opacity-90 ${toggleHover.isHovered ? "opacity-90" : ""}`}
        style={{ left: isOpen ? "33.3333%" : "0px" }}
      >
        {/* Collapse or expand indicator */}
        <span
          className={`inline-flex transition-transform duration-200 ${
            toggleHover.isHovered ? "scale-110" : ""
          }`}
        >
          {isOpen ? <ChevronLeft /> : <ChevronRight />}
        </span>
      </button>
    </>
  );
};

export default FloatingDataPanel;
