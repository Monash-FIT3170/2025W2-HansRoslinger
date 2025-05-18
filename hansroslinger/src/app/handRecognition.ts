import { HandLandmarker, FilesetResolver, DrawingUtils } from "@mediapipe/tasks-vision";

// TODO, get document element for video on page.ts


let handLandmarker: HandLandmarker |undefined = undefined;
const runningMode: "VIDEO" | "IMAGE" = "VIDEO";
// let enableWebcamButton: HTMLButtonElement;
// let webcamRunning: boolean = false;

// Before we can use HandLandmarker class we must wait for it to finish
// loading. Machine Learning models can be large and take a moment to
// get everything needed to run.
export const createHandLandmarker = async () => {
  const vision = await FilesetResolver.forVisionTasks(
    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
  );
  handLandmarker = await HandLandmarker.createFromOptions(vision, {
    baseOptions: {
      modelAssetPath: "/models/hand_landmarker.task",
      delegate: "CPU"
    },
    runningMode: runningMode,
    numHands: 2
  });
  console.log("loaded mediapipe")
  return handLandmarker;

};

export const HandRecogniser = async (video: HTMLVideoElement, canvas: HTMLCanvasElement ) =>{
   console.log("HandRecogniser started");

  if (!handLandmarker) {
    console.error("HandLandmarker is not initialized");
  }

  const canvasCtx = canvas.getContext("2d");
  const drawingUtils = new DrawingUtils(canvasCtx!);

  let lastVideoTime = -1;
  
  const predict = async() => {
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const startTimeMs = performance.now();
    if (lastVideoTime !== video.currentTime) {
      lastVideoTime = video.currentTime;
      const results = await handLandmarker.detectForVideo(video, startTimeMs);
    
      canvasCtx!.save();
      canvasCtx!.scale(-1, 1); 
      canvasCtx!.translate(-canvas.width, 0);
      canvasCtx!.clearRect(0, 0, canvas.width, canvas.height);
      
        
      for (const landmarks of results.landmarks) {
        console.log("Hand landmarks:", landmarks);
        drawingUtils.drawConnectors(landmarks, HandLandmarker.HAND_CONNECTIONS, {
          color: "#00FF00",
          lineWidth: 5
        });
        drawingUtils.drawLandmarks(landmarks, { color: "#FF0000", lineWidth: 2 });
      }
      
      canvasCtx!.restore();

    }
    setTimeout(() => requestAnimationFrame(predict), 100);

  }
  setTimeout(() => requestAnimationFrame(predict), 100);
}