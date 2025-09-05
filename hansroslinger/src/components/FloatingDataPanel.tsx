"use client";

import Image from "next/image";
import { usePanelStore } from "store/panelSlice";
import { useVisualStore } from "store/visualsSlice";
import { FILE_TYPE_PNG } from "constants/application";
import VegaLiteChartDisplay from "@/components/VegaLiteChartDisplay";
import { hardcodedUploads } from "../hardcodedData";

// FloatingDataPanel.tsx

const FloatingDataPanel = () => {
  // Store for panel open/close state
  const isOpen = usePanelStore((state) => state.isOpen);
  const toggle = usePanelStore((state) => state.toggle);

  // Store for managing selected visuals
  const addSelectedUpload = useVisualStore((state) => state.addSelectedUpload);
  const removeSelectedUpload = useVisualStore((state) => state.removeVisual);
  const visuals = useVisualStore((state) => state.visuals);

  // Utility: check if a visual with a given assetId already exists in store
  const isVisualExist = (assetId: string) => {
    return visuals.some((visual) => visual.assetId === assetId);
  };

  // Handles click on an asset card (toggles select/deselect)
  const handleClick = (assetId: string) => {
    const uploadData = hardcodedUploads[assetId];
    if (!uploadData) return; // guard: if no upload data, skip

    // Toggle behavior: remove if already added, otherwise add
    if (isVisualExist(assetId)) {
      removeSelectedUpload(assetId);
    } else {
      addSelectedUpload(assetId, uploadData);
    }
  };

return (
    <div
      className={`absolute left-0 top-0 h-full z-40 flex transition-all duration-300 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      {/* Panel container */}
      <div className="w-72 h-full overflow-y-auto bg-gray-300 border-r border-gray-400 rounded-r-lg shadow-lg p-4 flex flex-col text-black">
        {/* Heading */}
        <h2 className="text-lg font-bold mb-4 text-center bg-white rounded p-2 shadow">
          Uploaded Visuals
        </h2>

        {/* Grid of thumbnails */}
        <div className="grid grid-cols-2 gap-4 flex-1">
          {Object.entries(hardcodedUploads).map(([assetId, uploadData]) => (
            <div
              key={assetId}
              onClick={() => handleClick(assetId)}
              className={`cursor-pointer flex flex-col items-center`}
            >
              {/* Square thumbnail box */}
              <div
                className={`relative w-full aspect-square border rounded-md flex items-center justify-center bg-white overflow-hidden ${
                  isVisualExist(assetId)
                    ? "border-green-500 border-2"
                    : "border-gray-400"
                }`}
              >
                {uploadData.type === FILE_TYPE_PNG ? (
                  <Image
                    src={uploadData.thumbnailSrc || "/uploads/default-thumbnail.png"}
                    alt={uploadData.name}
                    className="max-w-[80%] max-h-[80%] object-contain"
                    width={80}
                    height={80}
                  />
                ) : (
                  <VegaLiteChartDisplay data={uploadData} />
                )}
              </div>

              {/* Label + file type */}
              <p className="mt-1 text-sm font-medium">{uploadData.name}</p>
              <p className="text-xs text-gray-600">{uploadData.type}</p>
            </div>
          ))}
        </div>

        {/* Action buttons */}
        <div className="mt-4 space-y-2">
          <button className="w-full py-2 bg-orange-500 text-white rounded shadow hover:bg-orange-600 text-sm font-semibold">
            Adjust Background
          </button>
          <button className="w-full py-2 bg-red-500 text-white rounded shadow hover:bg-red-600 text-sm font-semibold">
            Clear Canvas
          </button>
        </div>
      </div>

      {/* Toggle button */}
      <button
        onClick={toggle}
        className="absolute top-1/2 left-full -translate-y-1/2 w-8 h-12 bg-gray-200 text-black border border-l-0 border-gray-400 rounded-r shadow hover:bg-gray-300 flex items-center justify-center"
      >
        {isOpen ? "<" : ">"}
      </button>
    </div>
  );
};

export default FloatingDataPanel;