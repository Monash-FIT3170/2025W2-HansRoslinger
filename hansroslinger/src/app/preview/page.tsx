"use client";

import CameraFeed from "./CameraFeed";

const Preview = () => {
  return (
    <div className="flex items-start justify-center w-full">
      <div className="border-2 border-black w-full max-w-[1300px] aspect-video overflow-hidden bg-black">
        <CameraFeed />
      </div>
    </div>
  );
};

export default Preview;
