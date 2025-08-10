"use client";

import { useEffect, useRef, useState } from "react";
import { HandRecogniser } from "app/detection/handRecognition";
import { canvasRenderer } from "app/detection/canvasRenderer";
import { useGestureStore } from "store/gestureSlice";

/**
 * CameraFeed component handles accessing the user's camera and microphone.
 * It shows a mirrored live video feed with an error handling message if access fails.
 * Adds an annotation layer (draw/erase) on top of the camera feed.
 */
const CameraFeed = () => {
  // video canvas refs/state 
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null); // existing overlay canvas for landmarks/visuals
  const [cameraError, setCameraError] = useState(false);
  const setGesturePayload = useGestureStore((state) => state.setGesturePayloads);

  // keep track of the interval so we can clear it on unmount
  const intervalRef = useRef<number | null>(null);

  // annotation refs/state 
  const annotationCanvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawingRef = useRef(false);
  const lastPosRef = useRef<{ x: number; y: number } | null>(null);

  const [annotationOn, setAnnotationOn] = useState(false);
  const [tool, setTool] = useState<"draw" | "erase">("draw");
  const [strokeWidth, setStrokeWidth] = useState(4);
  const [strokeColor, setStrokeColor] = useState("#00ff88");

  // sizing helper (HiDPI-safe) 
  const sizeCanvasesToVideo = () => {
    const video = videoRef.current;
    if (!video) return;

    const rect = video.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    const apply = (c?: HTMLCanvasElement | null) => {
      if (!c) return;
      // CSS size to match rendered video
      c.style.width = `${rect.width}px`;
      c.style.height = `${rect.height}px`;
      // Backing store scaled for HiDPI
      c.width = Math.round(rect.width * dpr);
      c.height = Math.round(rect.height * dpr);
      const ctx = c.getContext("2d");
      if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    apply(canvasRef.current);
    apply(annotationCanvasRef.current);
  };

  // annotation helpers 
  const clearAnnotations = () => {
    const c = annotationCanvasRef.current;
    const ctx = c?.getContext("2d");
    if (c && ctx) ctx.clearRect(0, 0, c.width, c.height);
  };

  const getRelativePos = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = annotationCanvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!annotationOn) return;
    const canvas = annotationCanvasRef.current!;
    canvas.setPointerCapture(e.pointerId);
    isDrawingRef.current = true;
    lastPosRef.current = getRelativePos(e);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!annotationOn || !isDrawingRef.current) return;

    const canvas = annotationCanvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    const pos = getRelativePos(e);
    const last = lastPosRef.current!;

    // pen pressure option support
    const pressure = e.pressure && e.pressure > 0 ? e.pressure : 1;

    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    ctx.lineWidth = Math.max(1, strokeWidth * pressure);
    ctx.globalCompositeOperation =
      tool === "erase" ? "destination-out" : "source-over";
    if (tool === "draw") ctx.strokeStyle = strokeColor;

    ctx.beginPath();
    ctx.moveTo(last.x, last.y);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();

    lastPosRef.current = pos;
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!annotationOn) return;
    const canvas = annotationCanvasRef.current!;
    canvas.releasePointerCapture(e.pointerId);
    isDrawingRef.current = false;
    lastPosRef.current = null;
  };

  // camera detection loop 
  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });

        if (videoRef.current && canvasRef.current) {
          videoRef.current.srcObject = stream;

          // size canvases once the video lays out
          requestAnimationFrame(sizeCanvasesToVideo);
          // keep in sync on window resize
          window.addEventListener("resize", sizeCanvasesToVideo);

          // detection/render loop (100ms)
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
                  canvasRef.current
                );
                canvasRenderer(
                  canvasRef.current,
                  videoRef.current,
                  payload.gestureRecognitionResult
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
      // remove resize listener
      window.removeEventListener("resize", sizeCanvasesToVideo);

      // clear detection interval
      if (intervalRef.current != null) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }

      // stop camera tracks
      if (videoElement && videoElement.srcObject) {
        const tracks = (videoElement.srcObject as MediaStream).getTracks();
        tracks.forEach((track) => track.stop());
      }
    };
    //comment code below will ignore the warning from eslint
   // eslint-disable-next-line react-hooks/exhaustive-deps
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
          className="w-full h-full object-cover transform -scale-x-100 select-none"
        />
      )}

      {/* landmark overlay canvas visual */}
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 w-full h-full pointer-events-none"
      />

      {/* Annotation canvas (on top). Pointer events only when enabled */}
      <canvas
        ref={annotationCanvasRef}
        className={`absolute top-0 left-0 w-full h-full z-50 ${
          annotationOn ? "pointer-events-auto" : "pointer-events-none"
        }`}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      />

      {/* Annotation toolbar */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-[60] flex items-center gap-2 bg-black/60 text-white rounded-2xl px-3 py-2 backdrop-blur">
        <button
          onClick={() => setAnnotationOn((v) => !v)}
          className={`px-3 py-1 rounded-xl ${
            annotationOn ? "bg-white text-black" : "bg-white/10"
          }`}
          aria-pressed={annotationOn}
          title="Toggle annotations"
        >
          {annotationOn ? "Annotation: On" : "Annotation: Off"}
        </button>

        <div
          className={`flex items-center gap-2 ${
            annotationOn ? "opacity-100" : "opacity-40 pointer-events-none"
          }`}
        >
          <button
            onClick={() => setTool("draw")}
            className={`px-2 py-1 rounded ${
              tool === "draw" ? "bg-white text-black" : "bg-white/10"
            }`}
            aria-pressed={tool === "draw"}
            title="Draw"
          >
            ✏️
          </button>
          <button
            onClick={() => setTool("erase")}
            className={`px-2 py-1 rounded ${
              tool === "erase" ? "bg-white text-black" : "bg-white/10"
            }`}
            aria-pressed={tool === "erase"}
            title="Erase"
          >
            🧽
          </button>

          <label className="flex items-center gap-2 text-xs">
            <span>Color</span>
            <input
              type="color"
              value={strokeColor}
              onChange={(e) => setStrokeColor(e.target.value)}
              className="h-8 w-8 rounded overflow-hidden border border-white/20"
            />
          </label>

          <label className="flex items-center gap-2 text-xs">
            <span>Size</span>
            <input
              type="range"
              min={2}
              max={24}
              step={1}
              value={strokeWidth}
              onChange={(e) => setStrokeWidth(Number(e.target.value))}
              className="w-24"
            />
          </label>

          <button
            onClick={clearAnnotations}
            className="px-2 py-1 rounded bg-white/10"
            title="Clear"
          >
            Clear
          </button>
        </div>
      </div>

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
