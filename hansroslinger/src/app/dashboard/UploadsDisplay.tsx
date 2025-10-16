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
    <section className="w-full py-20 px-6 bg-gradient-to-b from-[#FED6A6]/5 via-[#FFEFD5]/20 to-[#FFF8F0]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 animate-slide-up">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-[#2a2a2a]">
            Your <span className="gradient-text-enhanced">Uploads</span>
          </h2>
          <p className="text-lg md:text-xl text-[#4a4a4a] max-w-2xl mx-auto">
            Click on any file to select it for preview
          </p>
        </div>
        
        <div className="overflow-x-auto pb-6">
          {!hasUploads && (
            <div className="modern-card-enhanced p-16 text-center animate-fade-in">
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-[#5C9BB8]/20 blur-2xl"></div>
                  <svg className="w-20 h-20 text-[#4a4a4a]/50 relative" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </div>
              </div>
              <p className="text-[#2a2a2a] mb-2 text-xl font-bold">No uploads found</p>
              <p className="text-[#4a4a4a] text-base">
                Click the Upload button above to add your files
              </p>
            </div>
          )}
          {hasUploads && (
            <div className="flex justify-center gap-8 p-6 min-w-max">
              {Object.entries(uploads).map(([assetId, data], idx) => (
                <div
                  key={assetId}
                  className={`group relative min-w-[220px] modern-card-enhanced p-6 flex flex-col items-center cursor-pointer transition-all duration-300 animate-scale-in hover-lift overflow-visible
                    ${isVisualExist(assetId) 
                      ? "ring-4 ring-[#5C9BB8]/60 shadow-lg shadow-[#5C9BB8]/30 scale-105" 
                      : "hover:ring-2 hover:ring-[#FC9770]/50"
                    }
                  `}
                  style={{ animationDelay: `${idx * 50}ms` }}
                  role="button"
                  onClick={() => handleCLick(assetId, data)}
                >
                  {/* Selection indicator */}
                  {isVisualExist(assetId) && (
                    <div className="absolute top-2 right-2 bg-[#5C9BB8] p-2.5 shadow-lg shadow-[#5C9BB8]/50 animate-scale-in z-10">
                      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                  
                  {/* Thumbnail container */}
                  <div className="relative w-32 h-32 mb-5 flex items-center justify-center bg-gradient-to-br from-[#FED6A6]/30 to-[#E5A168]/20 p-3 group-hover:scale-105 transition-transform shadow-inner border border-[#E5A168]/20">
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
                        sizes="128px"
                      />
                    ) : (
                      <VegaLiteChartDisplay data={data} />
                    )}
                  </div>
                  
                  <div className="w-full">
                    <div className="font-bold text-base mb-2 truncate text-center text-[#2a2a2a]">
                      {data.name}
                    </div>
                    <div className="flex items-center justify-center gap-1.5">
                      <span className="px-3 py-1.5 bg-gradient-to-r from-[#FED6A6]/60 via-[#E5A168]/50 to-[#FC9770]/40 text-[#2a2a2a] font-semibold text-xs uppercase tracking-wide border border-[#E5A168]/30">
                        {data.type}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default UploadsDisplay;
