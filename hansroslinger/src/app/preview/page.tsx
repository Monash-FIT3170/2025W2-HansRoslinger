"use client";

import dynamic from "next/dynamic";

import FloatingDataPanel from "@/components/FloatingDataPanel";

import CanvasOverlay from "@/components/KonvaOverlay";

const CameraFeed = dynamic(() => import("./CameraFeed"), {
  ssr: false,
});

const Preview = () => {
  return (
    <div className="flex justify-center px-4 sm:px-8">
      <div
        className="relative w-full max-w-full sm:max-w-2xl md:max-w-4xl lg:max-w-6xl xl:max-w-7xl 
        aspect-video border-2 border-black overflow-hidden bg-black"
      >
        <FloatingDataPanel />
        <CameraFeed />
        <CanvasOverlay />
      </div>
    </div>
  );
};

export default Preview;
