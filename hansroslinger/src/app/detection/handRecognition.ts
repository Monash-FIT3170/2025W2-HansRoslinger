import {
  GestureRecognizer,
  FilesetResolver,
} from "@mediapipe/tasks-vision";

import { isPinch } from "./pinch";

let gestureRecognizer: GestureRecognizer;
const runningMode: "VIDEO" | "IMAGE" = "VIDEO";

export const createGestureRecognizer = async () => {
  const vision = await FilesetResolver.forVisionTasks(
    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm",
  );
  gestureRecognizer = await GestureRecognizer.createFromOptions(vision, {
    baseOptions: {
      modelAssetPath:
        "https://storage.googleapis.com/mediapipe-tasks/gesture_recognizer/gesture_recognizer.task",
      delegate: "CPU",
    },
    runningMode: runningMode,
    numHands: 2,
  });
  console.log("gesture recognise mediapipe");
};
await createGestureRecognizer();

export const HandRecogniser = async (
  video: HTMLVideoElement,
) => {
  console.log("HandRecogniser started"); 

  const startTimeMs = performance.now();
    
  const gestureRecognitionResult = await gestureRecognizer.recognizeForVideo(video, startTimeMs);

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

  return gestureRecognitionResult;

};
