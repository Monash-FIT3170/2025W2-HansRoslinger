import { GestureRecognizer, FilesetResolver } from "@mediapipe/tasks-vision";
import { isPinch } from "./pinch";
import { GestureFactory } from "./GestureFactory";
import { GesturePayload } from "./Gesture";
import { PINCH } from "constants/application";

let gestureRecognizer: GestureRecognizer | null = null;
let isInitializing = false;
let initializationPromise: Promise<void> | null = null;
const runningMode: "VIDEO" | "IMAGE" = "VIDEO";

export const createGestureRecognizer = async () => {
  if (gestureRecognizer) {
    return; // Already initialized
  }
  
  if (isInitializing && initializationPromise) {
    await initializationPromise; // Wait for ongoing initialization
    return;
  }

  isInitializing = true;
  initializationPromise = (async () => {
    try {
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
      console.log("gesture recognise mediapipe initialized");
    } catch (error) {
      console.error("Failed to initialize gesture recognizer:", error);
      throw error;
    } finally {
      isInitializing = false;
    }
  })();
  
  await initializationPromise;
};

// Initialize on module load, but don't block
createGestureRecognizer().catch(console.error);

export const HandRecogniser = async (
  video: HTMLVideoElement,
  canvas: HTMLCanvasElement,
) => {
  console.log("HandRecogniser started");

  // Ensure gesture recognizer is initialized
  if (!gestureRecognizer) {
    await createGestureRecognizer();
  }

  if (!gestureRecognizer) {
    console.error("Gesture recognizer failed to initialize");
    return { payloads: [], gestureRecognitionResult: { gestures: [], worldLandmarks: [] } };
  }

  const startTimeMs = performance.now();

  const gestureRecognitionResult = gestureRecognizer.recognizeForVideo(
    video,
    startTimeMs,
  );
  let payloads: GesturePayload[] = [];

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

    const gesture = GestureFactory(categoryName);
    if (gesture) {
      const payload = gesture.payload(i, gestureRecognitionResult, canvas);
      payloads.push(payload);
    }
  });

  if (payloads.length === 2) {
    if (payloads[0].name == PINCH && payloads[1].name == PINCH) {
      payloads = [];
      const doublePinch = GestureFactory("DoublePinch");
      const doublePinchPayload = doublePinch!.payload(
        2,
        gestureRecognitionResult,
        canvas,
      );
      payloads.push(doublePinchPayload);
    }
  }

  return { payloads, gestureRecognitionResult };
};
