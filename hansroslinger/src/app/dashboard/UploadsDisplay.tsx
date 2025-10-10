"use client";

import VegaLiteChartDisplay from "@/components/VegaLiteChartDisplay";
import { useVisualStore } from "store/visualsSlice";
import { FILE_TYPE_PNG } from "constants/application";
import Image from "next/image";
import { UploadProp, Uploads } from "types/application";

type UploadsDisplayProps = {
  uploads: Uploads;
};

const UploadsDisplay = ({ uploads }: UploadsDisplayProps) => {
  const addSelectedUpload = useVisualStore((state) => state.addSelectedUpload);
  const removeSelectedUpload = useVisualStore((state) => state.removeVisual);
  const selectedUploads = useVisualStore((state) => state.visuals);

  const isVisualExist = (assetId: string) => {
    return selectedUploads.some((visual) => visual.assetId === assetId);
  };

  const handleCLick = (assetId: string, uploadData: UploadProp) => {
    if (isVisualExist(assetId)) {
      removeSelectedUpload(assetId);
      return;
    }
    addSelectedUpload(assetId, uploadData);
  };

  const hasUploads = Object.keys(uploads).length > 0;

  return (
    <section className="w-full mb-8 mt-8">
      <h2 className="text-3xl font-bold text-center mb-5">Uploads</h2>
      <div className="overflow-x-auto w-full pb-3">
        {!hasUploads && (
          <div className="text-center p-8 bg-gray-50 rounded-lg">
            <p className="text-gray-500 mb-2">No uploads found.</p>
            <p className="text-gray-400 text-sm">
              Click the Upload button below to add your files.
            </p>
          </div>
        )}
        {hasUploads && (
          <div className="flex justify-center gap-x-6 p-4 min-w-max">
            {Object.entries(uploads).map(([assetId, data]) => (
              <div
                key={assetId}
                className={`min-w-[180px] h-52 bg-white shadow-md 
                rounded-md flex flex-col items-center justify-center 
                p-3 text-center cursor-pointer hover:-translate-y-1 hover:shadow-lg
                ${isVisualExist(assetId) ? "border-4 border-green-500" : ""}
                `}
                role="button"
                onClick={() => handleCLick(assetId, data)}
              >
                <div className="relative w-24 h-24 m-3 flex items-center justify-center">
                  {data.type === FILE_TYPE_PNG ? (
                    <Image
                      src={
                        data.thumbnailSrc
                          ? data.thumbnailSrc
                          : "/uploads/default-thumbnail.png"
                      }
                      alt={data.name}
                      className="object-contain object-center"
                      fill={true}
                      sizes="max-width: 24px"
                    />
                  ) : (
                    <VegaLiteChartDisplay data={data} />
                  )}
                </div>
                <div className="font-semibold text-base">{data.name}</div>
                <div className="text-sm text-gray-500">{data.type}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default UploadsDisplay;
