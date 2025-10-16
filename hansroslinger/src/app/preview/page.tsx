"use client";

import dynamic from "next/dynamic";

import FloatingDataPanel from "@/components/FloatingDataPanel";

import CanvasOverlay from "@/components/KonvaOverlay";

const CameraFeed = dynamic(() => import("./CameraFeed"), {
  ssr: false,
});

const Preview = () => {
  return (
    <main className="flex-1 p-8 relative overflow-hidden">
      {/* Enhanced Background decoration to match dashboard */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#F5F9FC] via-[#5C9BB8]/10 to-[#E8F0F7]/25 -z-10"></div>
      
      {/* Floating background orbs */}
      <div className="absolute top-10 left-[10%] w-96 h-96 bg-gradient-to-r from-[#5C9BB8]/10 to-[#FC9770]/10 blur-3xl animate-float-slow opacity-40"></div>
      <div className="absolute bottom-20 right-[15%] w-80 h-80 bg-gradient-to-r from-[#FBC841]/10 to-[#E5A168]/10 blur-3xl animate-float-delayed opacity-40"></div>

      <section className="max-w-7xl mx-auto relative z-10">
        <div className="mb-8 flex items-center justify-between animate-fade-in">
          <div>
            <h1 className="text-4xl md:text-6xl font-bold mb-2">
              Live <span className="gradient-text-enhanced">Preview</span>
            </h1>
            <p className="text-lg md:text-xl text-[#4a4a4a]/90 leading-relaxed">
              Interact with the camera feed and overlays
            </p>
          </div>
        </div>

        <div className="flex justify-center px-4 sm:px-8 animate-scale-in">
          <div
            className="relative w-full max-w-full sm:max-w-2xl md:max-w-4xl lg:max-w-6xl xl:max-w-7xl aspect-video bg-black border-2 border-[#5C9BB8]/30 shadow-2xl shadow-[#5C9BB8]/20 overflow-hidden"
          >
            {/* Decorative corner accents */}
            <div className="absolute top-0 left-0 w-12 h-12 border-t-4 border-l-4 border-[#5C9BB8] z-10"></div>
            <div className="absolute top-0 right-0 w-12 h-12 border-t-4 border-r-4 border-[#FC9770] z-10"></div>
            <div className="absolute bottom-0 left-0 w-12 h-12 border-b-4 border-l-4 border-[#FBC841] z-10"></div>
            <div className="absolute bottom-0 right-0 w-12 h-12 border-b-4 border-r-4 border-[#E5A168] z-10"></div>
            
            <CameraFeed />
            <CanvasOverlay />
          </div>
        </div>
      </section>
    </main>
  );
};

export default Preview;
