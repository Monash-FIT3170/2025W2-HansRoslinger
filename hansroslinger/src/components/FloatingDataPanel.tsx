// src/components/FloatingDataPanel.tsx
"use client";

import Image from "next/image";
import { usePanelStore } from "store/panelSlice";
import { useVisualStore } from "store/visualsSlice";
import { FILE_TYPE_PNG } from "constants/application";
import VegaLiteChartDisplay from "@/components/VegaLiteChartDisplay";
import { hardcodedUploads } from "../hardcodedData";

const FloatingDataPanel = () => {
  const isOpen = usePanelStore((state) => state.isOpen);
  const toggle = usePanelStore((state) => state.toggle);

  const addSelectedUpload = useVisualStore((state) => state.addSelectedUpload);
  const removeSelectedUpload = useVisualStore((state) => state.removeVisual);
  const visuals = useVisualStore((state) => state.visuals);

  const isVisualExist = (assetId: string) => {
    return visuals.some((visual) => visual.assetId === assetId);
  };

  const handleClick = (assetId: string) => {
    const uploadData = hardcodedUploads[assetId];
    if (!uploadData) return;

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
      style={{
        pointerEvents: "auto",
      }}
    >
      {/* Panel Content */}
      <div className="w-64 max-h-[70vh] overflow-y-auto bg-white/70 border backdrop-blur rounded shadow p-3 space-y-2 text-black">
        <h2 className="text-lg font-semibold mb-2">Uploads</h2>

        {Object.entries(hardcodedUploads).length === 0 ? (
          <div className="text-sm text-gray-500">No visuals uploaded.</div>
        ) : (
          Object.entries(hardcodedUploads).map(([assetId, uploadData]) => (
            <div
              key={assetId}
              onClick={() => handleClick(assetId)}
              className={`w-full cursor-pointer border rounded p-2 bg-white bg-opacity-90 hover:bg-gray-100 ${
                isVisualExist(assetId)
                  ? "border-green-500 border-2"
                  : "border-gray-300"
              }`}
            >
              <div className="w-full h-32 relative mb-2">
                {uploadData.type === FILE_TYPE_PNG ? (
                  <Image
                    src={uploadData.thumbnailSrc || "/uploads/default-thumbnail.png"}
                    alt={uploadData.name}
                    className="object-contain"
                    fill
                    sizes="100%"
                  />
                ) : (
                  <VegaLiteChartDisplay data={uploadData} />
                )}
              </div>
              <div className="font-medium text-sm truncate">{uploadData.name}</div>
              <div className="text-xs text-gray-500">{uploadData.type}</div>
            </div>
          ))
        )}
      </div>

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
