"use client";
import { useEffect, useRef, useState } from "react";
import { HandRecogniser } from "app/detection/handRecognition";
import { canvasRenderer } from "app/detection/canvasRenderer";
/**
 * CameraFeed component handles accessing the user's camera and microphone.
 * It shows a mirrored live video feed with an error handling message if access fails.
 */
const CameraFeed = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [cameraError, setCameraError] = useState(false);
  console.log("CameraFeed component is rendering!");

  useEffect(() => {
    const startCamera = async () => {
      try {
        console.log("camera");
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        
          if (videoRef.current && canvasRef.current) {

            videoRef.current.srcObject = stream;
            setInterval(() => {
              requestAnimationFrame(async () => {
                if (videoRef.current && canvasRef.current) {
                  const payload = await HandRecogniser(videoRef.current, canvasRef.current);
                  console.log(payload);
                  canvasRenderer(canvasRef.current, videoRef.current, payload.gestureRecognitionResult);
                }
              });
            }, 100);            
          }

      } catch (err) {
        console.error("Error accessing camera:", err);
        setCameraError(true);
      }
    };
    startCamera();

    const videoElement = videoRef.current;

    return () => {
      if (videoElement && videoElement.srcObject) {
        const tracks = (videoElement.srcObject as MediaStream).getTracks();
        tracks.forEach((track) => track.stop());
      }
    };
  }, []);

  return (
    <div className="relative w-full h-full">
      {/* Show video if no error */}
      {!cameraError && (
        <video
          id="cameraFeed"
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover transform -scale-x-100"
        />
      )}
      <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full" />

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
