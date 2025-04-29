"use client";

import { useEffect, useRef, useState } from "react";

/**
 * CameraFeed component handles accessing the user's camera and microphone.
 * It shows a mirrored live video feed with an error handling message if access fails.
 */
const CameraFeed = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [cameraError, setCameraError] = useState(false);

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Error accessing camera:", err);
        setCameraError(true);
      }
    };

    startCamera();

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach((track) => track.stop());
      }
    };
  }, []);

  return (
    <div className="relative w-full h-full">
      {/* Show video if no error */}
      {!cameraError && (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover transform -scale-x-100"
        />
      )}

      {/* Show error message if camera is not available */}
      {cameraError && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-70">
          <div className="text-center px-4 text-white text-lg font-semibold">
            Camera and microphone is not detected. <br />
            Please check your device settings.
          </div>
        </div>
      )}
    </div>
  );
};

export default CameraFeed;
