import {
  GestureRecognizer,
  HandLandmarker,
  FilesetResolver,
  DrawingUtils,
} from "@mediapipe/tasks-vision";

let handLandmarker: HandLandmarker | undefined = undefined;
let gestureRecognizer: GestureRecognizer;
const runningMode: "VIDEO" | "IMAGE" = "VIDEO";

export const createHandLandmarker = async () => {
  const vision = await FilesetResolver.forVisionTasks(
    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasms",
  );
  handLandmarker = await HandLandmarker.createFromOptions(vision, {
    baseOptions: {
      modelAssetPath: "/models/hand_landmarker.task",
      delegate: "GPU",
    },
    runningMode: runningMode,
    numHands: 2,
  });
  return handLandmarker;
};

export const createGestureRecognizer = async () => {
  const vision = await FilesetResolver.forVisionTasks(
    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm",
  );
  gestureRecognizer = await GestureRecognizer.createFromOptions(vision, {
    baseOptions: {
      modelAssetPath:
        "https://storage.googleapis.com/mediapipe-tasks/gesture_recognizer/gesture_recognizer.task",
      delegate: "GPU",
    },
    runningMode: runningMode,
    numHands: 2,
  });
  console.log("gesture recognise mediapipe");
};
await createGestureRecognizer();

/**
 * Detects if the hand is making a pinch gesture.
 * @param worldLandmarks The 3D landmarks of a hand from Mediapipe.
 * @param threshold Distance threshold to consider it a pinch.
 * @returns true if pinching, false otherwise.
 */
export const isPinch = (
  worldLandmarks: { x: number; y: number; z: number }[],
  threshold = 0.07,
): boolean => {
  if (!worldLandmarks || worldLandmarks.length < 9) {
    console.log("huh");
    return false;
  }

  const thumbTip = worldLandmarks[4];
  const indexTip = worldLandmarks[8];

  const dx = thumbTip.x - indexTip.x;
  const dy = thumbTip.y - indexTip.y;
  const dz = thumbTip.z - indexTip.z;

  const distance = Math.hypot(dx, dy, dz);

  return distance < threshold;
};

export const HandRecogniser = async (
  video: HTMLVideoElement,
  canvas: HTMLCanvasElement,
) => {
  console.log("HandRecogniser started");
  //await createHandLandmarker();

  const canvasCtx = canvas.getContext("2d");
  const drawingUtils = new DrawingUtils(canvasCtx!);

  let lastVideoTime = -1;

  const predict = async () => {
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const startTimeMs = performance.now();
    if (lastVideoTime !== video.currentTime) {
      lastVideoTime = video.currentTime;
      //const results = await handLandmarker.detectForVideo(video, startTimeMs);
      const gestureRecognitionResult =
        await gestureRecognizer.recognizeForVideo(video, startTimeMs);

      canvasCtx!.save();
      canvasCtx!.scale(-1, 1);
      canvasCtx!.translate(-canvas.width, 0);
      canvasCtx!.clearRect(0, 0, canvas.width, canvas.height);

      console.log(gestureRecognitionResult);
      for (let i = 0; i < gestureRecognitionResult.worldLandmarks.length; i++) {
        const landmarks = gestureRecognitionResult.landmarks[i];
        //console.log(results);

        console.log("Hand landmarks:", landmarks);
        drawingUtils.drawConnectors(
          landmarks,
          HandLandmarker.HAND_CONNECTIONS,
          {
            color: "#00FF00",
            lineWidth: 5,
          },
        );
        drawingUtils.drawLandmarks(landmarks, {
          color: "#FF0000",
          lineWidth: 2,
        });
      }

      canvasCtx!.restore();

      gestureRecognitionResult.gestures.forEach((gestureCandidates, i) => {
        let categoryName = gestureCandidates[0]?.categoryName;
        let categoryScore =
          Math.round((gestureCandidates[0]?.score ?? 0) * 10000) / 100;

        // Check pinch if gesture is not recognized
        if (
          categoryName === "None" &&
          isPinch(gestureRecognitionResult.worldLandmarks[i])
        ) {
          categoryName = "Pinch";
          categoryScore = -1;
        }

        console.log(
          `Hand ${i + 1}: Detected gesture: ${categoryName}, Confidence: ${categoryScore}%`,
        );
      });
    }
    setTimeout(() => requestAnimationFrame(predict), 100);
  };
  setTimeout(() => requestAnimationFrame(predict), 100);
};
