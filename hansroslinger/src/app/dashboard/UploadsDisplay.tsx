"use client";

import VegaLiteChartDisplay from "@/components/VegaLiteChartDisplay";
import { useUploadStore } from "app/store/uploadsSlice";
import { FILE_TYPE_PNG } from "constants/application";
import Image from "next/image";
import { UploadProp, Uploads } from "types/application";

type UploadsDisplayProps = {
  uploads: Uploads;
};

const UploadsDisplay = ({ uploads }: UploadsDisplayProps) => {
  const setSelectedUpload = useUploadStore((state) => state.setSelectedUpload);
  const removeSelectedUpload = useUploadStore(
    (state) => state.removeSelectedUpload,
  );
  const selectedUploads = useUploadStore((state) => state.selectedUploads);

  const handleCLick = (assetId: string, uploadData: UploadProp) => {
    if (assetId in selectedUploads) {
      removeSelectedUpload(assetId);
      return;
    }
    setSelectedUpload(assetId, uploadData);
  };

  return (
    <section className="w-full mb-8 mt-8">
      <h2 className="text-3xl font-bold text-center mb-5">Uploads</h2>
      <div className="overflow-x-auto w-full pb-3">
        <div className="flex justify-center gap-x-6 p-4 min-w-max">
          {Object.entries(uploads).map(([assetId, data]) => (
            <div
              key={assetId}
              className={`min-w-[180px] h-52 bg-white shadow-md 
                rounded-md flex flex-col items-center justify-center 
                p-3 text-center cursor-pointer hover:-translate-y-1 hover:shadow-lg
                ${assetId in selectedUploads ? "border-4 border-green-500" : ""}
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
      </div>
    </section>
  );
};

export default UploadsDisplay;
