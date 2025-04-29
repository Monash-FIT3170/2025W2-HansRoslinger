"use client";

import { useEffect, useRef } from "react";

const Preview = () => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // function to start accessing the use's camera
    const startCamera = async () => {
      try {
        // request access to the user's camera and microphone
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Error accessing camera:", err);
      }
    };

    startCamera();

    // Cleanup function to stop the camera when the component unmounts
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach((track) => track.stop());
      }
    };
  }, []);

  return (
    // Main container for the preview (centered video frame horizontally)
    <div className="flex items-start justify-center w-full">
      <div className="border-2 border-black w-full max-w-[1300px] aspect-video overflow-hidden">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          // transform -scale-x-100 to mirror the video horizontally
          className="w-full h-full object-cover transform -scale-x-100"
        />
      </div>
    </div>
  );
};

export default Preview;
