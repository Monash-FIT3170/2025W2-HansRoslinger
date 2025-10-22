"use client";

import VegaLiteChartDisplay from "@/components/VegaLiteChartDisplay";
import { useVisualStore } from "store/visualsSlice";
import { FILE_TYPE_PNG } from "constants/application";
import Image from "next/image";
import { UploadProp, Uploads } from "types/application";
import Link from "next/link";

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
    <section className="w-full py-24 px-6 relative overflow-hidden subtle-glow">
      {/* Background with animated gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#F5F9FC]/50 via-[#E8F0F7]/30 to-transparent"></div>

      {/* Floating background orbs */}
      <div className="absolute top-10 left-[10%] w-96 h-96 bg-gradient-to-r from-[#5C9BB8]/10 to-[#FC9770]/10 blur-3xl animate-float-slow opacity-40"></div>
      <div className="absolute bottom-20 right-[15%] w-80 h-80 bg-gradient-to-r from-[#FBC841]/10 to-[#E5A168]/10 blur-3xl animate-float-delayed opacity-40"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16 animate-slide-up">
          <h2 className="text-4xl md:text-6xl font-bold mb-5 text-[#2a2a2a]">
            Your <span className="gradient-text-enhanced">Uploads</span>
          </h2>
          <p className="text-lg md:text-xl text-[#4a4a4a]/90 max-w-2xl mx-auto leading-relaxed">
            Click on any file to select it for preview
          </p>
        </div>

        <div className="overflow-x-auto pb-8 scrollbar-thin">
          {!hasUploads && (
            <div className="modern-card-enhanced p-20 text-center animate-fade-in max-w-2xl mx-auto backdrop-blur-sm bg-white/80">
              <div className="flex justify-center mb-8">
                <div className="relative">
                  {/* Glow effect */}
                  <div className="absolute inset-0 bg-[#5C9BB8]/30 blur-3xl animate-pulse"></div>
                  <div className="relative bg-gradient-to-br from-[#5C9BB8]/20 to-[#FC9770]/20 p-8 backdrop-blur-sm">
                    <svg
                      className="w-24 h-24 text-[#5C9BB8] relative"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      />
                    </svg>
                  </div>
                </div>
              </div>
              <p className="text-[#2a2a2a] mb-3 text-2xl font-bold">
                No uploads yet
              </p>
              <p className="text-[#4a4a4a]/80 text-lg leading-relaxed">
                Start by clicking the{" "}
                <span className="text-[#5C9BB8] font-semibold">Upload</span>{" "}
                button above to add your files
              </p>
            </div>
          )}
          {hasUploads && (
            <div className="flex justify-center gap-10 p-8 min-w-max">
              {Object.entries(uploads).map(([assetId, data], idx) => (
                <div
                  key={assetId}
                  className={`group relative w-[280px] backdrop-blur-md transition-all duration-500 cursor-pointer
                    ${
                      isVisualExist(assetId)
                        ? "bg-white/95 shadow-2xl shadow-[#5C9BB8]/40 ring-2 ring-[#5C9BB8] scale-105 -translate-y-3"
                        : "bg-white/80 shadow-xl hover:shadow-2xl hover:bg-white/95 hover:-translate-y-3 hover:ring-2 hover:ring-[#FC9770]/40"
                    }
                  `}
                  style={{
                    animationDelay: `${idx * 80}ms`,
                    animation: "scaleIn 0.5s ease-out backwards",
                  }}
                  role="button"
                  onClick={() => handleCLick(assetId, data)}
                >
                  {/* Animated gradient overlay on hover */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br from-[#5C9BB8]/8 via-[#FC9770]/5 to-[#FBC841]/8 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`}
                  ></div>

                  {/* Animated border glow */}
                  <div
                    className={`absolute -inset-0.5 bg-gradient-to-r from-[#5C9BB8] via-[#FC9770] to-[#FBC841] opacity-0 blur-sm transition-opacity duration-500 pointer-events-none
                    ${isVisualExist(assetId) ? "opacity-30" : "group-hover:opacity-20"}
                  `}
                  ></div>

                  {/* Content wrapper with padding */}
                  <div className="relative p-7">
                    {/* Enhanced selection indicator */}
                    {isVisualExist(assetId) && (
                      <div className="absolute -top-3 -right-3 z-20">
                        <div className="relative animate-scale-in">
                          {/* Glow effect */}
                          <div className="absolute inset-0 bg-[#5C9BB8] blur-md opacity-60"></div>
                          <div className="relative bg-gradient-to-br from-[#5C9BB8] to-[#4a89a6] p-3 shadow-xl border-4 border-white">
                            <svg
                              className="w-5 h-5 text-white drop-shadow-md"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Enhanced thumbnail container */}
                    <div className="relative w-full aspect-square mb-6 flex items-center justify-center bg-gradient-to-br from-[#F5F9FC] via-[#E8F0F7]/60 to-[#D8E4F0]/40 p-5 overflow-hidden group-hover:scale-[1.03] transition-all duration-500 border border-[#5C9BB8]/15 shadow-inner">
                      {/* Shine effect */}
                      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>

                      {/* Animated corner accents */}
                      <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-[#5C9BB8]/30 group-hover:border-[#5C9BB8]/60 transition-colors duration-300"></div>
                      <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-[#FC9770]/30 group-hover:border-[#FC9770]/60 transition-colors duration-300"></div>

                      {data.type === FILE_TYPE_PNG ? (
                        <Image
                          src={
                            data.thumbnailSrc
                              ? data.thumbnailSrc
                              : "/uploads/default-thumbnail.png"
                          }
                          alt={data.name}
                          className="object-contain object-center relative z-10 drop-shadow-lg"
                          fill={true}
                          sizes="240px"
                        />
                      ) : (
                        <VegaLiteChartDisplay data={data} />
                      )}
                    </div>

                    <div className="w-full space-y-4">
                      <div className="font-bold text-lg truncate text-center text-[#2a2a2a] group-hover:text-[#5C9BB8] transition-colors duration-300 px-2">
                        {data.name}
                      </div>
                      <div className="flex items-center justify-center">
                        <div className="relative">
                          {/* Badge glow */}
                          <div className="absolute inset-0 bg-gradient-to-r from-[#5C9BB8] to-[#7BAFD4] blur-md opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
                          <span className="relative px-5 py-2 bg-gradient-to-r from-[#5C9BB8] to-[#7BAFD4] text-white font-bold text-xs uppercase tracking-widest shadow-lg group-hover:shadow-xl group-hover:scale-105 transition-all duration-300 inline-block">
                            {data.type}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        {/* Bottom action button: Enter Preview */}
        <div className="mt-10 flex justify-center">
          <Link
            href="/preview"
            className="group relative inline-flex items-center justify-center gap-3 w-60 bg-gradient-to-r from-[#FC9770] to-[#fb8659] px-10 py-4 text-base font-bold text-white shadow-xl shadow-[#FC9770]/50 transition-all duration-300 hover:shadow-2xl hover:shadow-[#FC9770]/70 hover:-translate-y-2 hover:scale-105 active:translate-y-0 active:scale-100 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
            <div className="absolute -inset-0.5 bg-gradient-to-r from-[#FC9770] to-[#FBC841] opacity-0 group-hover:opacity-75 blur-sm transition-opacity duration-300"></div>
            <svg
              className="w-6 h-6 transition-transform group-hover:scale-110 group-hover:rotate-12 relative z-10"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
            <span className="relative z-10 tracking-wide">Enter Preview</span>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default UploadsDisplay;
