"use client";

import dynamic from "next/dynamic";

import FloatingDataPanel from "@/components/FloatingDataPanel";

import CanvasOverlay from "@/components/KonvaOverlay";
import ReturnToDashboard from "@/components/ReturnToDashboard";

const CameraFeed = dynamic(() => import("./CameraFeed"), {
  ssr: false,
});

const Preview = () => {
  return (
    <main className="flex-1 relative overflow-hidden">
      {/* Enhanced Background decoration to match dashboard */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#F5F9FC] via-[#5C9BB8]/10 to-[#E8F0F7]/25 -z-10"></div>

      {/* Floating background orbs - matching dashboard animation */}
      <div className="absolute top-20 left-[15%] w-80 h-80 bg-gradient-to-r from-[#FC9770]/30 to-[#FBC841]/30 blur-3xl animate-float"></div>
      <div className="absolute top-40 right-[20%] w-96 h-96 bg-gradient-to-r from-[#5C9BB8]/30 to-[#FED6A6]/25 blur-3xl animate-float-delayed"></div>
      <div className="absolute bottom-20 left-[40%] w-72 h-72 bg-gradient-to-r from-[#E5A168]/25 to-[#5C9BB8]/20 blur-3xl animate-float-slow"></div>

      <section className="relative py-16 px-6 min-h-screen flex flex-col items-center justify-center">
        <div className="max-w-7xl mx-auto w-full relative z-10">
          {/* Return to Dashboard Button - Top Right */}
          <div className="absolute top-0 right-6 z-30 animate-slide-down">
            <ReturnToDashboard />
          </div>

          {/* Header Section - matching dashboard style */}
          <div className="text-center mb-12 animate-fade-in">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-5 leading-tight tracking-tight">
              <div className="relative inline-block">
                <span className="gradient-text-enhanced drop-shadow-lg">
                  Live
                </span>
                {/* Subtle underline accent */}
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-3/4 h-1 bg-gradient-to-r from-transparent via-[#5C9BB8]/40 to-transparent"></div>
              </div>{" "}
              <span className="gradient-text-enhanced drop-shadow-lg">
                Preview
              </span>
            </h1>
            <p
              className="text-lg md:text-xl text-[#4a4a4a]/90 leading-relaxed max-w-3xl mx-auto mt-6 animate-slide-up"
              style={{ animationDelay: "200ms" }}
            >
              Interact with the camera feed and overlays
            </p>
          </div>

          {/* Camera Feed Container - enhanced styling */}
          <div
            className="flex justify-center animate-scale-in"
            style={{ animationDelay: "400ms" }}
          >
            <div className="relative w-full max-w-full sm:max-w-3xl md:max-w-5xl lg:max-w-6xl xl:max-w-7xl">
              <div className="relative aspect-video bg-black shadow-2xl overflow-hidden group">
                {/* Enhanced border with gradient glow effect */}
                <div className="absolute -inset-[3px] bg-gradient-to-br from-[#5C9BB8] via-[#FC9770] to-[#FBC841] opacity-60 blur-sm group-hover:opacity-80 transition-opacity duration-500"></div>

                {/* Inner container */}
                <div className="relative w-full h-full bg-black overflow-hidden">
                  {/* Decorative corner accents - enhanced */}
                  <div className="absolute top-0 left-0 w-16 h-16 border-t-4 border-l-4 border-[#5C9BB8] z-10 transition-all duration-300 group-hover:w-20 group-hover:h-20"></div>
                  <div className="absolute top-0 right-0 w-16 h-16 border-t-4 border-r-4 border-[#FC9770] z-10 transition-all duration-300 group-hover:w-20 group-hover:h-20"></div>
                  <div className="absolute bottom-0 left-0 w-16 h-16 border-b-4 border-l-4 border-[#FBC841] z-10 transition-all duration-300 group-hover:w-20 group-hover:h-20"></div>
                  <div className="absolute bottom-0 right-0 w-16 h-16 border-b-4 border-r-4 border-[#E5A168] z-10 transition-all duration-300 group-hover:w-20 group-hover:h-20"></div>

                  {/* Interaction Mode Indicator removed to avoid overlap with ModeToggle in AnnotationLayer */}

                  {/* Camera Feed and Overlays */}
                  <CameraFeed />
                  <CanvasOverlay />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Preview;
