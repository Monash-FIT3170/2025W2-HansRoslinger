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
      className={`absolute left-0 top-1/2 -translate-y-1/2 z-40 flex transition-all duration-300 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      {/* Panel container */}
      <div className="w-64 max-h-[80vh] overflow-y-auto bg-gray-200 border-r backdrop-blur rounded-r-lg shadow p-3 flex flex-col text-black">
        <h2 className="text-md font-bold mb-3 text-center bg-white rounded p-1">
          Uploaded Visuals
        </h2>

        {/* Grid of uploads */}
        <div className="grid grid-cols-2 gap-3 flex-1">
          {Object.entries(hardcodedUploads).length === 0 ? (
            <div className="col-span-2 text-sm text-gray-500 text-center">
              No visuals uploaded.
            </div>
          ) : (
            Object.entries(hardcodedUploads).map(([assetId, uploadData]) => (
              <div
                key={assetId}
                onClick={() => handleClick(assetId)}
                className={`cursor-pointer border rounded-lg p-2 bg-white flex flex-col items-center justify-center text-center hover:bg-gray-100 ${
                  isVisualExist(assetId)
                    ? "border-green-500 border-2"
                    : "border-gray-300"
                }`}
              >
                <div className="w-16 h-16 relative mb-1">
                  {uploadData.type === FILE_TYPE_PNG ? (
                    <Image
                      src={
                        uploadData.thumbnailSrc ||
                        "/uploads/default-thumbnail.png"
                      }
                      alt={uploadData.name}
                      className="object-contain"
                      fill
                      sizes="100%"
                    />
                  ) : (
                    <VegaLiteChartDisplay data={uploadData} />
                  )}
                </div>
                <div className="font-medium text-xs truncate w-full">
                  {uploadData.name}
                </div>
                <div className="text-[10px] text-gray-500">{uploadData.type}</div>
              </div>
            ))
          )}
        </div>

        {/* Divider */}
        <div className="border-t my-3" />

        {/* Action buttons */}
        <div className="space-y-2">
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
        className="absolute top-1/2 left-full -translate-y-1/2 w-8 h-12 bg-white border border-l-0 rounded-r shadow hover:bg-gray-100 flex items-center justify-center"
      >
        {isOpen ? "<" : ">"}
      </button>
    </div>
  );
};

export default FloatingDataPanel;