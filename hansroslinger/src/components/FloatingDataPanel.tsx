/**
 * FloatingDataPanel.tsx
 *
 * This component renders a floating side panel that displays uploaded visuals (images or charts).
 * - It uses Zustand stores (`usePanelStore`, `useVisualStore`) to manage open/close state and selected visuals.
 * - The panel shows a grid of "uploads" from `hardcodedUploads`, which can be toggled (added/removed) when clicked.
 * - Each visual is displayed as either an image thumbnail (for PNGs) or a VegaLite chart.
 * - A toggle button is always visible on the left side of the screen to open/close the panel.
 *
 * Key responsibilities:
 * - Display uploaded visuals in a scrollable, interactive grid.
 * - Allow users to select/deselect visuals via click.
 * - Manage UI feedback (highlighting selected/hovered visuals).
 * - Provide a collapsible panel UI that overlays the page.
 */
"use client";

import Image from "next/image";
import { usePanelStore } from "store/panelSlice";
import { useVisualStore } from "store/visualsSlice";
import { FILE_TYPE_PNG } from "constants/application";
import VegaLiteChartDisplay from "@/components/VegaLiteChartDisplay";
import { hardcodedUploads } from "../hardcodedData";

// allow hardcoded uploads accessible
// if (typeof window !== "undefined") {
//   (window as any).hardcodedUploads = hardcodedUploads;
// }

// Panel store state
const FloatingDataPanel = () => {
  const isOpen = usePanelStore((state) => state.isOpen); //whether panel open or not
  const toggle = usePanelStore((state) => state.toggle); //to toggle panel open and close

  // Visuals store state
  const addSelectedUpload = useVisualStore((state) => state.addSelectedUpload); //add visual to selection
  const removeSelectedUpload = useVisualStore((state) => state.removeVisual); //remove visual from selection
  const visuals = useVisualStore((state) => state.visuals); //currently selected visuals

  //Function to check if a visual is already selected
  //Input: assetId, ID of asset
  const isVisualExist = (assetId: string) => {
    return visuals.some((visual) => visual.assetId === assetId);
  };

  //Function to Handle user clicking on a visual tile
  // Input: assetId, ID of asset
  const handleClick = (assetId: string) => {
    const uploadData = hardcodedUploads[assetId];
    if (!uploadData) return;
    if (isVisualExist(assetId)) {
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
              <h2 className="text-lg font-bold tracking-wide">Uploaded Visuals</h2>
              <button
                onClick={toggle}
                aria-label="Close uploads panel"
                className="absolute right-0 top-1/2 -translate-y-1/2 text-[#4b5563] hover:text-[#111827] px-2"
              >
                ×
              </button>
            </div>
          </div>

          {/* Visuals section */}
          <div className="flex-1 overflow-y-auto px-6 py-4">
            <div className="flex flex-col gap-4">
              {Object.entries(hardcodedUploads).map(([assetId, uploadData], idx) => {
                // find visual object that corresponds to assetId
                const visual = visuals.find((v) => v.assetId === assetId);
                //check if visual currently hovered for highlighting
                const isHovered = visual?.isHovered;
                const isSelected = isVisualExist(assetId);

                return (
                  <div
                    key={assetId}
                    data-asset-id={assetId}
                    onClick={() => handleClick(assetId)}
                    className={`group relative backdrop-blur-md transition-all duration-500 cursor-pointer p-4 animate-scale-in ${
                      isSelected
                        ? "bg-white/95 shadow-2xl shadow-[#5C9BB8]/40 ring-2 ring-[#5C9BB8] scale-[1.02] -translate-y-1"
                        : "bg-white/80 shadow-lg hover:shadow-2xl hover:bg-white/95 hover:-translate-y-1 hover:ring-2 hover:ring-[#FC9770]/40"
                    } ${isHovered ? "ring-2 ring-[#5C9BB8]" : ""}`}
                    style={{
                      animationDelay: `${idx * 80}ms`,
                    }}
                  >
                    {/* Gradient border accent on top */}
                    <div
                      className={`absolute top-0 left-0 right-0 h-1 transition-all duration-500 ${
                        isSelected
                          ? "bg-gradient-to-r from-[#5C9BB8] via-[#FC9770] to-[#FBC841] opacity-100"
                          : "bg-gradient-to-r from-[#FC9770]/40 to-[#FBC841]/40 opacity-0 group-hover:opacity-100"
                      }`}
                    ></div>

                    <div className="flex items-center gap-4">
                      {/* === THUMBNAIL / PREVIEW === */}
                      <div
                        className={`relative w-24 h-24 border bg-white flex items-center justify-center overflow-hidden shrink-0 transition-all duration-300 ${
                          isSelected
                            ? "border-[#5C9BB8] shadow-md"
                            : "border-gray-200 group-hover:border-[#FC9770]/50"
                        }`}
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
          </div>
        </div>
      )}

      {/* toggle button */}
      <button
        onClick={toggle}
        aria-label={isOpen ? "Collapse uploads panel" : "Expand uploads panel"}
        className="absolute -translate-y-1/2 z-50 w-8 h-20 bg-gradient-to-b from-[#5C9BB8] to-[#FC9770] text-white rounded-r shadow-xl hover:opacity-95 flex items-center justify-center text-base font-bold top-1/2"
        style={{ left: isOpen ? "33.3333%" : "0px" }}
      >
        {/* Collapse or expand indicator */}
        {isOpen ? "‹" : "›"}
      </button>
    </>
  );
};

export default FloatingDataPanel;
