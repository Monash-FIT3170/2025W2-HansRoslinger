"use client";


import { useRef } from "react";
import dynamic from "next/dynamic";
import CanvasOverlay from "@/components/KonvaOverlay";
const CameraFeed = dynamic(() => import("./CameraFeed"), { ssr: false });
const StreamControls = dynamic(() => import("@/components/livestream/StreamControls"), { ssr: false });

const Preview = () => {
  const videoRef = useRef<HTMLVideoElement>(null) as React.RefObject<HTMLVideoElement>;
  const canvasRef = useRef<HTMLCanvasElement>(null) as React.RefObject<HTMLCanvasElement>;
  return (
    <div className="flex justify-center px-4 sm:px-8">
      <div
        className="relative w-full max-w-full sm:max-w-2xl md:max-w-4xl lg:max-w-6xl xl:max-w-7xl aspect-video border-2 border-black overflow-hidden bg-black"
      >
        <CameraFeed videoRef={videoRef} canvasRef={canvasRef} />
        <CanvasOverlay />
        <StreamControls videoRef={videoRef} canvasRef={canvasRef} />
      </div>
    </div>
  );
};

export default Preview;
