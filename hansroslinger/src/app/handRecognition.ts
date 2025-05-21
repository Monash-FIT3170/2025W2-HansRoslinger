import { GestureRecognizer, HandLandmarker, FilesetResolver, DrawingUtils } from "@mediapipe/tasks-vision";
import * as fp from 'fingerpose';
// TODO, get document element for video on page.ts


let handLandmarker: HandLandmarker |undefined = undefined;
let gestureRecognizer: GestureRecognizer;
const runningMode: "VIDEO" | "IMAGE" = "VIDEO";
const GE: fp.GestureEstimator = new fp.GestureEstimator([fp.Gestures.ThumbsUpGesture, fp.Gestures.VictoryGesture]);
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
  console.log("loaded hand landmark mediapipe")
  return handLandmarker;
};

export const createGestureRecognizer = async () => {
  const vision = await FilesetResolver.forVisionTasks(
    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm"
  );
  gestureRecognizer = await GestureRecognizer.createFromOptions(vision, {
    baseOptions: {
      modelAssetPath:
        "https://storage.googleapis.com/mediapipe-models/gesture_recognizer/gesture_recognizer/float16/1/gesture_recognizer.task",
      delegate: "GPU"
    },
    runningMode: runningMode
  });
  console.log("gesture recognise mediapipe")
};
createGestureRecognizer();

export const HandRecogniser = async (video: HTMLVideoElement, canvas: HTMLCanvasElement ) =>{
   console.log("HandRecogniser started");

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
      const gestureRecognitionResult = gestureRecognizer.recognizeForVideo(video,startTimeMs);


      canvasCtx!.save();
      canvasCtx!.scale(-1, 1); 
      canvasCtx!.translate(-canvas.width, 0);
      canvasCtx!.clearRect(0, 0, canvas.width, canvas.height);
      
      console.log(results)
      for (let i =0; i<results.worldLandmarks.length; i++) {
        
        const landmarks = results.landmarks[i];
        console.log("Hand landmarks:", landmarks);
        drawingUtils.drawConnectors(landmarks, HandLandmarker.HAND_CONNECTIONS, {
          color: "#00FF00",
          lineWidth: 5
        });
        drawingUtils.drawLandmarks(landmarks, { color: "#FF0000", lineWidth: 2 });
      }
      
      canvasCtx!.restore();
      if (gestureRecognitionResult.gestures.length > 0) {
        const categoryName = gestureRecognitionResult.gestures[0][0].categoryName;
        const categoryScore = Math.round(gestureRecognitionResult.gestures[0][0].score * 10000) / 100;
        console.log(`Detected gesture: ${categoryName}, Confidence: ${categoryScore}%`);
      }

    }
    setTimeout(() => requestAnimationFrame(predict), 100);

  }
  setTimeout(() => requestAnimationFrame(predict), 100);
}