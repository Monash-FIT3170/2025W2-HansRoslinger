"use client";

import Image from "next/image";
import { usePanelStore } from "store/panelSlice";
import { useVisualStore } from "store/visualsSlice";
import { FILE_TYPE_PNG } from "constants/application";
import VegaLiteChartDisplay from "@/components/VegaLiteChartDisplay";
import { hardcodedUploads } from "../hardcodedData";

// allow hardcoded uploads accessible
if (typeof window !== "undefined") {
  (window as any).hardcodedUploads = hardcodedUploads;
}

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
    <>
      {/* Panel */}
      {isOpen && (
        <div className="absolute top-0 left-0 bottom-0 z-40 w-[40rem] h-full overflow-y-auto bg-gray-400/70 border-r border-gray-500 shadow-lg p-4 flex flex-col text-black">
          {/* Header */}
          <div className="bg-gray-300 text-black rounded p-3 mb-4 text-center">
            <h2 className="text-lg font-bold">Uploaded Visuals</h2>
          </div>

          {/* Visuals section */}
          <div className="flex-1 overflow-y-auto">
            <div className="grid grid-cols-2 gap-x-8 gap-y-10 px-4">
              {Object.entries(hardcodedUploads).map(([assetId, uploadData]) => {
                const visual = visuals.find((v) => v.assetId === assetId);
                const isHovered = visual?.isHovered;

                return (
                  <div
                    key={assetId}
                    data-asset-id={assetId}
                    onClick={() => handleClick(assetId)}
                    className={`cursor-pointer flex flex-col items-center p-2 rounded ${isHovered ? "ring-2 ring-green-400" : ""}`}
                  >
                    <div
                      className={`relative w-52 h-52 border-2 rounded bg-white flex items-center justify-center overflow-hidden ${
                        isVisualExist(assetId)
                          ? "border-green-400"
                          : "border-gray-300"
                      }`}
                    >
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
        className="absolute top-1/2 left-0 -translate-y-1/2 z-50 w-6 h-16 bg-gray-400 text-black border border-l-0 border-gray-500 rounded-r shadow hover:bg-gray-300 flex items-center justify-center text-sm font-bold"
      >
        {isOpen ? "<" : ">"}
      </button>
    </>
  );
};

export default FloatingDataPanel;
