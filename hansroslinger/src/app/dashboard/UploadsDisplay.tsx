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
    <section className="w-full py-20 px-6 bg-gradient-to-b from-[#F5F9FC]/40 via-[#F8FAFB]/60 to-[#FAFCFD]">
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
                  className={`group relative w-[260px] backdrop-blur-sm transition-all duration-500 animate-scale-in overflow-visible
                    ${isVisualExist(assetId) 
                      ? "bg-white/90 shadow-2xl shadow-[#5C9BB8]/30 ring-2 ring-[#5C9BB8]/40 scale-105 -translate-y-2" 
                      : "bg-white/70 shadow-xl hover:shadow-2xl hover:bg-white/90 hover:-translate-y-2 hover:ring-2 hover:ring-[#FC9770]/30"
                    }
                  `}
                  style={{ animationDelay: `${idx * 50}ms` }}
                  role="button"
                  onClick={() => handleCLick(assetId, data)}
                >
                  {/* Gradient overlay on hover */}
                  <div className={`absolute inset-0 bg-gradient-to-br from-[#5C9BB8]/5 via-transparent to-[#FC9770]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`}></div>
                  
                  {/* Content wrapper with padding */}
                  <div className="relative p-6">
                    {/* Selection indicator */}
                    {isVisualExist(assetId) && (
                      <div className="absolute -top-2 -right-2 bg-gradient-to-br from-[#5C9BB8] to-[#7BAFD4] p-2.5 shadow-lg shadow-[#5C9BB8]/50 animate-scale-in z-10 border-4 border-white">
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                    
                    {/* Thumbnail container */}
                    <div className="relative w-full aspect-square mb-5 flex items-center justify-center bg-gradient-to-br from-[#F5F9FC] via-[#E8F0F7]/50 to-[#D8E4F0]/30 p-4 overflow-hidden group-hover:scale-[1.02] transition-all duration-500 border border-[#5C9BB8]/10">
                      {/* Shine effect */}
                      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                      
                      {data.type === FILE_TYPE_PNG ? (
                        <Image
                          src={
                            data.thumbnailSrc
                              ? data.thumbnailSrc
                              : "/uploads/default-thumbnail.png"
                          }
                          alt={data.name}
                          className="object-contain object-center relative z-10"
                          fill={true}
                          sizes="220px"
                        />
                      ) : (
                        <VegaLiteChartDisplay data={data} />
                      )}
                    </div>
                    
                    <div className="w-full space-y-3">
                      <div className="font-bold text-base truncate text-center text-[#2a2a2a] group-hover:text-[#5C9BB8] transition-colors duration-300">
                        {data.name}
                      </div>
                      <div className="flex items-center justify-center">
                        <span className="px-4 py-1.5 bg-gradient-to-r from-[#5C9BB8] to-[#7BAFD4] text-white font-semibold text-xs uppercase tracking-wider shadow-md">
                          {data.type}
                        </span>
                      </div>
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
