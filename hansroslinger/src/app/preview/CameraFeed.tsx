"use client";

import { useEffect, useRef, useState } from "react";
import { HandRecogniser } from "app/detection/handRecognition";
import { canvasRenderer } from "app/detection/canvasRenderer";
import { useGestureStore } from "store/gestureSlice";
import AnnotationLayer from "./AnnotationLayer";
import { useContainerStore } from "store/containerSlice";
import { GestureRecognizerResult } from "@mediapipe/tasks-vision";

/**
 * CameraFeed component handles accessing the user's camera and microphone.
 * Shows a mirrored live video feed with landmarks overlay.
 * Annotation layer feature (draw/erase) on top of the camera feed.
 */
const CameraFeed = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [cameraError, setCameraError] = useState(false);
  const setGesturePayload = useGestureStore(
    (state) => state.setGesturePayloads,
  );

  const setContainerEl = useContainerStore((s) => s.setContainerEl);

  useEffect(() => {
    setContainerEl(containerRef.current);
    return () => setContainerEl(null);
  }, [setContainerEl]);

  // keep track of the interval so we can clear it on unmount
  const intervalRef = useRef<number | null>(null);

  // Size overlay canvas to match the rendered video (HiDPI-safe)
  const sizeOverlayToVideo = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    const rect = video.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;
    canvas.width = Math.round(rect.width * dpr);
    canvas.height = Math.round(rect.height * dpr);

    const ctx = canvas.getContext("2d");
    if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });

        if (videoRef.current && canvasRef.current) {
          videoRef.current.srcObject = stream;

          // size overlay once laid out and on resize
          requestAnimationFrame(sizeOverlayToVideo);
          window.addEventListener("resize", sizeOverlayToVideo);

          // original detection/render loop
          intervalRef.current = window.setInterval(async () => {
            if (videoRef.current && canvasRef.current) {
              if (
                videoRef.current.videoWidth > 0 &&
                videoRef.current.videoHeight > 0 &&
                canvasRef.current.width > 0 &&
                canvasRef.current.height > 0
              ) {
                const payload = await HandRecogniser(
                  videoRef.current,
                  canvasRef.current,
                );
                canvasRenderer(
                  canvasRef.current,
                  videoRef.current,
                  payload.gestureRecognitionResult as GestureRecognizerResult,
                );
                setGesturePayload(payload.payloads);
              }
            }
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
      window.removeEventListener("resize", sizeOverlayToVideo);
      if (intervalRef.current != null) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      if (videoElement && videoElement.srcObject) {
        const tracks = (videoElement.srcObject as MediaStream).getTracks();
        tracks.forEach((track) => track.stop());
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div ref={containerRef} className="relative w-full h-full">
      {/* Video layer (mirrored) */}
      {!cameraError && (
        <video
          id="cameraFeed"
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover transform -scale-x-100 select-none"
        />
      )}

      {/* Existing overlay canvas for landmarks/visuals */}
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 w-full h-full pointer-events-none"
      />

      {/* Annotation layer */}
      <AnnotationLayer targetRef={videoRef} />

      {/* Error banner */}
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
