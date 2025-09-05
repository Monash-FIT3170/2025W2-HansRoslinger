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
      className={`absolute left-0 top-[12.5%] h-[75%] z-40 flex transition-all duration-300 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      {/* Panel container */}
      <div className="w-64 h-full overflow-y-auto bg-gray-400 border-r border-gray-500 shadow-lg p-3 flex flex-col text-black">
        {/* Heading */}
        <div className="bg-gray-300 text-black rounded p-3 mb-4 text-center">
          <h2 className="text-base font-bold">Uploaded Visuals</h2>
        </div>

        {/* Scrollable thumbnails section */}
        <div className="flex-1 py-4 border-t border-b border-gray-500">
          <div className="overflow-x-auto">
            <div className="grid grid-rows-2 grid-flow-col gap-4 w-max">
              {Object.entries(hardcodedUploads).map(([assetId, uploadData]) => (
                <div
                  key={assetId}
                  onClick={() => handleClick(assetId)}
                  className={`cursor-pointer flex flex-col items-center w-28`}
                >
                  {/* Square thumbnail box */}
                  <div
                    className={`relative w-24 h-24 border-2 rounded flex items-center justify-center bg-white overflow-hidden ${
                      isVisualExist(assetId)
                        ? "border-green-400"
                        : "border-gray-300"
                    }`}
                  >
                    {uploadData.type === FILE_TYPE_PNG ? (
                      <Image
                        src={uploadData.thumbnailSrc || "/uploads/default-thumbnail.png"}
                        alt={uploadData.name}
                        className="max-w-[80%] max-h-[80%] object-contain"
                        width={70}
                        height={70}
                      />
                    ) : (
                      <VegaLiteChartDisplay data={uploadData} />
                    )}
                  </div>

                  {/* Label + file type */}
                  <p className="mt-1 text-xs font-medium text-center leading-tight truncate w-full">{uploadData.name}</p>
                  <p className="text-xs text-gray-500 uppercase">{uploadData.type}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="mt-4 space-y-3">
          <button className="w-full py-2.5 bg-orange-600 text-white rounded shadow hover:bg-orange-700 text-sm font-semibold">
            Adjust Background
          </button>
          <button className="w-full py-2.5 bg-orange-600 text-white rounded shadow hover:bg-orange-700 text-sm font-semibold">
            Clear Canvas
          </button>
        </div>
      </div>

      {/* Toggle button */}
      <button
        onClick={toggle}
        className="absolute top-1/2 left-full -translate-y-1/2 w-6 h-16 bg-gray-400 text-black border border-l-0 border-gray-500 rounded-r shadow hover:bg-gray-300 flex items-center justify-center text-sm font-bold"
      >
        {isOpen ? "<" : ">"}
      </button>
    </div>
  );
};

export default FloatingDataPanel;