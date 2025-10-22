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
import { useState } from "react";

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
  const isVisualSelected = (assetId: string) => {
    return visuals.some((visual) => visual.assetId === assetId);
  };

  //Function to Handle user clicking on a visual tile
  // Input: assetId, ID of asset
  const handleClick = (assetId: string) => {
    const uploadData = hardcodedUploads[assetId];
    if (!uploadData) return;
    if (isVisualSelected(assetId)) {
      // If already selected, remove it
      removeSelectedUpload(assetId);
    } else {
      // If not, add it
      addSelectedUpload(assetId, uploadData);
    }
  };

  // To use for hover simulations
  const [isExpandButtonHovered, setIsExpandButtonHovered] = useState(false);
  const [hoveredAsset, setHoveredAsset] = useState<string | null>(null);

  return (
    <>
      {/* Panel */}
      {isOpen && (
        <div className="absolute top-0 left-0 bottom-0 z-40 w-[40rem] h-full bg-gray-400/70 border-r border-gray-500 shadow-lg p-4 flex flex-col text-black">
          {/* Header */}
          <div className="bg-gray-300 text-black rounded p-3 mb-4 text-center flex-shrink-0">
            <h2 className="text-lg font-bold">Uploaded Visuals</h2>
          </div>

          {/* Visuals section */}
          <div className="flex-1 overflow-y-auto">
            <div className="grid grid-cols-2 gap-x-8 gap-y-10 px-4 pb-4">
              {Object.entries(hardcodedUploads).map(([assetId, uploadData]) => {
                return (
                  <div
                    key={assetId}
                    data-asset-id={assetId}
                    onClick={() => handleClick(assetId)}
                    onMouseEnter={() => setHoveredAsset(assetId)}
                    onMouseLeave={() => setHoveredAsset(null)}
                    className={`cursor-pointer flex flex-col items-center p-2 rounded-lg border transition-all duration-200 transform
                                ${
                                  isVisualSelected(assetId)
                                    ? "border-green-500 border-2"
                                    : "border-gray-300"
                                }
                                ${
                                  hoveredAsset === assetId
                                    ? "bg-gray-100 shadow-lg scale-105"
                                    : "hover:bg-gray-100 hover:shadow-lg hover:scale-105"
                                }`}
                  >
                    {/* === THUMBNAIL / PREVIEW === */}
                    <div
                      className={`relative w-52 h-52 rounded bg-white flex items-center justify-center overflow-hidden `}
                    >
                      {/* Render image if it's a PNG, otherwise render VegaLite chart */}
                      {uploadData.type === FILE_TYPE_PNG ? (
                        <Image
                          src={
                            uploadData.thumbnailSrc ||
                            "/uploads/default-thumbnail.png"
                          }
                          alt={uploadData.name}
                          className="max-w-[90%] max-h-[90%] object-contain"
                          width={150}
                          height={150}
                        />
                      ) : (
                        <VegaLiteChartDisplay data={uploadData} />
                      )}
                    </div>

                    {/* === LABELS === */}
                    <p className="mt-3 text-base font-medium text-center w-full">
                      {uploadData.name}
                    </p>
                    <p className="text-xs text-gray-600 uppercase">
                      {uploadData.type}
                    </p>
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
        onMouseEnter={() => setIsExpandButtonHovered(true)}
        onMouseLeave={() => setIsExpandButtonHovered(false)}
        className={`absolute top-1/2 -translate-y-1/2 z-50 w-14 h-24 sm:w-16 sm:h-28
      border border-gray-500 rounded-r shadow flex items-center justify-center text-lg font-bold
      ${isOpen ? "left-[40rem]" : "left-0 border-l-0"}
      ${isExpandButtonHovered ? "bg-gray-300" : "bg-gray-400 text-black"}
    `}
      >
        {isOpen ? "<" : ">"}
      </button>
    </>
  );
};

export default FloatingDataPanel;
