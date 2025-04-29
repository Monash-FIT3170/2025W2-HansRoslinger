"use client";

import { useEffect, useRef, useState } from "react";

const Preview = () => {
  const videoRef = useRef<HTMLVideoElement>(null);

  const [cameraError, setCameraError] = useState(false);

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
        setCameraError(true); // Set error state if camera presence is not detected
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
        {/* Show video only if no error */}
        {!cameraError && (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="w-full h-full object-cover transform -scale-x-100"
          />
        )}

        {/* Error message overlay */}
        {cameraError && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center px-4 text-black text-lg font-semibold">
              Camera and microphone is not detected. <br />
              Please check your device settings.
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Preview;
