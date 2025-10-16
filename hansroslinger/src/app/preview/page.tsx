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
      {/* Background decoration to match dashboard */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#F5F9FC] via-[#5C9BB8]/10 to-[#E8F0F7]/25 -z-10"></div>

      <section className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-4xl font-bold">
            Live <span className="gradient-text">Preview</span>
          </h1>
          <p className="text-[#4a4a4a] mt-1">Interact with the camera feed and overlays</p>
        </div>

        <div className="flex justify-center px-4 sm:px-8">
          <div
            className="relative w-full max-w-full sm:max-w-2xl md:max-w-4xl lg:max-w-6xl xl:max-w-7xl aspect-video bg-black border border-[#5C9BB8]/20 shadow-xl"
          >
            <CameraFeed />
            <CanvasOverlay />
          </div>
        </div>
      </section>
    </main>
  );
};

export default Preview;
