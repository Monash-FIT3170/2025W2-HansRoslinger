"use client";

import { useEffect, useRef, useState } from "react";
import { HandRecogniser } from "app/detection/handRecognition";
import { canvasRenderer } from "app/detection/canvasRenderer";
import { processBackgroundRemoval, processBackgroundBlur } from "app/detection/ImageSegmentation";
import { useGestureStore } from "store/gestureSlice";
import AnnotationLayer from "./AnnotationLayer";
import { useContainerStore } from "store/containerSlice";
import { GestureRecognizerResult } from "@mediapipe/tasks-vision";
import FloatingDataPanel from "@/components/FloatingDataPanel";

/**
 * CameraFeed component handles accessing the user's camera and microphone.
 * Shows a mirrored live video feed with landmarks overlay.
 * Annotation layer feature (draw/erase) on top of the camera feed.
 */
const CameraFeed = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const backgroundCanvasRef = useRef<HTMLCanvasElement>(null);
  const [cameraError, setCameraError] = useState(false);
  const [backgroundRemovalEnabled, setBackgroundRemovalEnabled] = useState(false);
  const [backgroundType, setBackgroundType] = useState<"transparent" | "solid" | "blur">("transparent");
  const [backgroundColor, setBackgroundColor] = useState("#00ff88");
  const [blurRadius, setBlurRadius] = useState(10);
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
    const backgroundCanvas = backgroundCanvasRef.current;
    if (!video || !canvas) return;

    const rect = video.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;
    canvas.width = Math.round(rect.width * dpr);
    canvas.height = Math.round(rect.height * dpr);

    if (backgroundCanvas) {
      backgroundCanvas.style.width = `${rect.width}px`;
      backgroundCanvas.style.height = `${rect.height}px`;
      backgroundCanvas.width = Math.round(rect.width * dpr);
      backgroundCanvas.height = Math.round(rect.height * dpr);
    }

    const ctx = canvas.getContext("2d");
    if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    
    const bgCtx = backgroundCanvas?.getContext("2d");
    if (bgCtx) bgCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
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
                // Process background removal if enabled
                if (backgroundRemovalEnabled && backgroundCanvasRef.current) {
                  if (backgroundType === "blur") {
                    await processBackgroundBlur(
                      videoRef.current,
                      backgroundCanvasRef.current,
                      blurRadius
                    );
                  } else {
                    await processBackgroundRemoval(
                      videoRef.current,
                      backgroundCanvasRef.current,
                      backgroundType === "transparent" ? "transparent" : backgroundColor
                    );
                  }
                }

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
          className={`w-full h-full object-cover transform -scale-x-100 select-none ${
            backgroundRemovalEnabled ? "hidden" : ""
          }`}
        />
      )}

      {/* Background removal canvas layer */}
      {backgroundRemovalEnabled && (
        <canvas
          ref={backgroundCanvasRef}
          className="absolute top-0 left-0 w-full h-full pointer-events-none"
        />
      )}

      {/* Existing overlay canvas for landmarks/visuals */}
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 w-full h-full pointer-events-none"
      />

      {/* Annotation layer */}
      <AnnotationLayer targetRef={videoRef} />
      <FloatingDataPanel />

      {/* Background removal controls */}
      <div className="absolute top-4 right-4 flex flex-col gap-2 bg-black/60 text-white rounded-lg p-3 backdrop-blur">
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="backgroundRemoval"
            checked={backgroundRemovalEnabled}
            onChange={(e) => setBackgroundRemovalEnabled(e.target.checked)}
            className="rounded"
          />
          <label htmlFor="backgroundRemoval" className="text-sm font-medium">
            Remove Background
          </label>
        </div>

        {backgroundRemovalEnabled && (
          <div className="flex flex-col gap-2 text-xs">
            <div className="flex gap-1">
              <button
                onClick={() => setBackgroundType("transparent")}
                className={`px-2 py-1 rounded text-xs ${
                  backgroundType === "transparent"
                    ? "bg-white text-black"
                    : "bg-white/20"
                }`}
              >
                Transparent
              </button>
              <button
                onClick={() => setBackgroundType("solid")}
                className={`px-2 py-1 rounded text-xs ${
                  backgroundType === "solid"
                    ? "bg-white text-black"
                    : "bg-white/20"
                }`}
              >
                Solid
              </button>
              <button
                onClick={() => setBackgroundType("blur")}
                className={`px-2 py-1 rounded text-xs ${
                  backgroundType === "blur"
                    ? "bg-white text-black"
                    : "bg-white/20"
                }`}
              >
                Blur
              </button>
            </div>

            {backgroundType === "solid" && (
              <div className="flex items-center gap-2">
                <label className="text-xs">Color:</label>
                <input
                  type="color"
                  value={backgroundColor}
                  onChange={(e) => setBackgroundColor(e.target.value)}
                  className="h-6 w-8 rounded border border-white/20"
                />
              </div>
            )}

            {backgroundType === "blur" && (
              <div className="flex items-center gap-2">
                <label className="text-xs">Blur:</label>
                <input
                  type="range"
                  min="2"
                  max="20"
                  value={blurRadius}
                  onChange={(e) => setBlurRadius(Number(e.target.value))}
                  className="w-16"
                />
                <span className="text-xs">{blurRadius}px</span>
              </div>
            )}
          </div>
        )}
      </div>

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
