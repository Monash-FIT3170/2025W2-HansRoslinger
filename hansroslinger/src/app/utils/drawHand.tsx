import * as handpose from "@tensorflow-models/handpose";
import { Coords3D } from "@tensorflow-models/handpose/dist/pipeline";

// Type for finger joints
export interface FingerJointsType {
  thumb: number[];
  indexFinger: number[];
  middleFinger: number[];
  ringFinger: number[];
  pinky: number[];
}

// finger joints mapping
const fingerJoints = {
  thumb: [1, 2, 3, 4],
  indexFinger: [5, 6, 7, 8],
  middleFinger: [9, 10, 11, 12],
  ringFinger: [13, 14, 15, 16],
  pinky: [17, 18, 19, 20],
  knuckles: [0, 1, 2, 5, 9, 13, 17, 0]
};

// Yubi brand colors
const YUBI_COLORS = {
  orange: "#F6A161",
  yellow: "#FDCA51",
  teal: "#649B9A",
  offWhite: "#FFF8F2",
};

// Style for each landmark using Yubi colors
const style: Record<number, { color: string; size: number }> = {
  0: { color: YUBI_COLORS.teal, size: 20 },
  1: { color: YUBI_COLORS.teal, size: 10 },
  2: { color: YUBI_COLORS.teal, size: 10 },
  3: { color: YUBI_COLORS.orange, size: 6 },
  4: { color: YUBI_COLORS.yellow, size: 10 },
  5: { color: YUBI_COLORS.teal, size: 10 },
  6: { color: YUBI_COLORS.orange, size: 6 },
  7: { color: YUBI_COLORS.orange, size: 6 },
  8: { color: YUBI_COLORS.yellow, size: 10 },
  9: { color: YUBI_COLORS.teal, size: 10 },
  10: { color: YUBI_COLORS.orange, size: 6 },
  11: { color: YUBI_COLORS.orange, size: 6 },
  12: { color: YUBI_COLORS.orange, size: 6 },
  13: { color: YUBI_COLORS.teal, size: 10 },
  14: { color: YUBI_COLORS.orange, size: 6 },
  15: { color: YUBI_COLORS.orange, size: 6 },
  16: { color: YUBI_COLORS.orange, size: 6 },
  17: { color: YUBI_COLORS.teal, size: 10 },
  18: { color: YUBI_COLORS.orange, size: 6 },
  19: { color: YUBI_COLORS.orange, size: 6 },
  20: { color: YUBI_COLORS.orange, size: 6 },
};

// Drawing function
export const drawHand = (
  predictions: handpose.AnnotatedPrediction[],
  ctx: CanvasRenderingContext2D
): void => {
  if (predictions.length === 0) {
    console.log("drawHand: No hands detected.");
    return;
  }

  predictions.forEach((prediction) => {
    const landmarks = prediction.landmarks;

    console.log("drawHand: Drawing landmarks:", landmarks);

    // Draw finger connections
    Object.keys(fingerJoints).forEach((finger) => {
      const points = fingerJoints[finger as keyof FingerJointsType];
      for (let k = 0; k < points.length - 1; k++) {
        const firstJointIndex = points[k];
        const secondJointIndex = points[k + 1];

        ctx.beginPath();
        ctx.moveTo(
          landmarks[firstJointIndex][0], // Use x-coordinate
          landmarks[firstJointIndex][1]  // Use y-coordinate
        );
        ctx.lineTo(
          landmarks[secondJointIndex][0], // Use x-coordinate
          landmarks[secondJointIndex][1]  // Use y-coordinate
        );
        ctx.strokeStyle = YUBI_COLORS.teal;
        ctx.lineWidth = 4;
        ctx.stroke();
      }
    });

    // Draw each landmark point
    for (let i = 0; i < landmarks.length; i++) {
      const x = landmarks[i][0]; // Use x-coordinate
      const y = landmarks[i][1]; // Use y-coordinate
      console.log(`Drawing point at (${x}, ${y})`);
      if (x < 0 || y < 0 || x > ctx.canvas.width || y > ctx.canvas.height) {
        console.warn(`Point (${x}, ${y}) is outside the canvas bounds.`);
      }
      ctx.beginPath();
      ctx.arc(x, y, style[i].size, 0, 2 * Math.PI);
      ctx.fillStyle = style[i].color;
      ctx.fill();
    }
  });
};
