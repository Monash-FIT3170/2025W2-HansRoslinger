import * as fp from "fingerpose";
import grabGesture from "../gestures/grabGesture";
import pinchGesture from "../gestures/pinchGesture";
import { IGesture } from "../types/core/IGesture";

export type GestureRecognition = IGesture | null;

export const GestureRecognition = (hand: any): GestureRecognition => {
  if (!hand) {
    console.log("GestureRecognition: No hand detected.");
    return null;
  }

  console.log("GestureRecognition: Hand detected, initializing GestureEstimator.");

  // Initialize the GestureEstimator with custom gestures
  const GE: fp.GestureEstimator = new fp.GestureEstimator([grabGesture, pinchGesture]);

  // Estimate the gesture based on hand landmarks
  const gesture = GE.estimate(hand.landmarks, 8);
  console.log("GestureRecognition: Gesture estimation result:", gesture);

  // Return the gesture result as IGesture
  if (gesture.gestures.length > 0) {
    const bestGesture = gesture.gestures[0];
    console.log("GestureRecognition: Best gesture detected:", bestGesture);
    return {
      name: bestGesture.name,
      confidence: bestGesture.score,
    };
  }

  console.log("GestureRecognition: No gesture detected.");
  return null;
};