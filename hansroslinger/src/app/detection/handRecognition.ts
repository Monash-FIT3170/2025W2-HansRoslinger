import { GestureRecognizer, FilesetResolver } from "@mediapipe/tasks-vision";
import { isPinch } from "./pinch";
import { GestureFactory } from "./GestureFactory";
import { GesturePayload } from "./Gesture";
import { PINCH } from "constants/application";

let gestureRecognizer: GestureRecognizer;
const runningMode: "VIDEO" | "IMAGE" = "VIDEO";

// track the last 3 detected categoryNames for each hand index
type History = Array<string>;
const gestureHistory: [History, History] = [[], []];

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

export const HandRecogniser = async (
  video: HTMLVideoElement,
  canvas: HTMLCanvasElement,
) => {
  console.log("HandRecogniser started");

  const startTimeMs = performance.now();

  const gestureRecognitionResult = gestureRecognizer.recognizeForVideo(
    video,
    startTimeMs,
  );
  let payloads: GesturePayload[] = [];

  gestureRecognitionResult.gestures.forEach((gestureCandidates, i) => {
    // 1) raw detection
    let categoryName = gestureCandidates[0]?.categoryName;
    let categoryScore =
      Math.round((gestureCandidates[0]?.score ?? 0) * 10000) / 100;

    // 2) fallback to pinch
    if (
      categoryName === "None" &&
      isPinch(gestureRecognitionResult.worldLandmarks[i])
    ) {
      categoryName = "Pinch";
      categoryScore = -1;
    }

    // 3) update history and confirm over 3 frames
    const history = gestureHistory[i];
    history.push(categoryName ?? "None");
    if (history.length > 3) {
      history.shift();
    }

    // log the history for this hand
    console.log(`Hand ${i + 1} history:`, [...history]);

    // only proceed once we’ve seen the same name three times in a row
    if (history.length < 3 || !history.every((n) => n === categoryName)) {
      console.log(
        `Hand ${i + 1}: waiting for stable "${categoryName}"…`,
        history,
      );
      return;
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

  // log all gesture histories
  console.log("gestureHistory buffer:", gestureHistory);

  // double-pinch logic
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