"use client";

import CameraFeed from "./CameraFeed";
import KonvaOverlay from "@/components/KonvaOverlay";

export default function Preview() {
  return (
    <div className="relative w-full max-w-full">
      <CameraFeed />
      <KonvaOverlay />
    </div>
  );
}

export default Preview;
