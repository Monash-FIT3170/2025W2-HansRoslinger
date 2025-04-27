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
  thumb: [0, 1, 2, 3, 4],
  indexFinger: [0, 5, 6, 7, 8],
  middleFinger: [0, 9, 10, 11, 12],
  ringFinger: [0, 13, 14, 15, 16],
  pinky: [0, 17, 18, 19, 20],
};

// style for each landmark
const style: Record<number, { color: string; size: number }> = {
  0: { color: "yellow", size: 15 },
  1: { color: "gold", size: 6 },
  2: { color: "green", size: 10 },
  3: { color: "gold", size: 6 },
  4: { color: "gold", size: 6 },
  5: { color: "purple", size: 10 },
  6: { color: "gold", size: 6 },
  7: { color: "gold", size: 6 },
  8: { color: "gold", size: 6 },
  9: { color: "blue", size: 10 },
  10: { color: "gold", size: 6 },
  11: { color: "gold", size: 6 },
  12: { color: "gold", size: 6 },
  13: { color: "red", size: 10 },
  14: { color: "gold", size: 6 },
  15: { color: "gold", size: 6 },
  16: { color: "gold", size: 6 },
  17: { color: "orange", size: 10 },
  18: { color: "gold", size: 6 },
  19: { color: "gold", size: 6 },
  20: { color: "gold", size: 6 },
};

// Drawing function
export const drawHand = (
  predictions: handpose.AnnotatedPrediction[],
  ctx: CanvasRenderingContext2D
): void => {
  if (predictions.length > 0) {
    predictions.forEach((prediction) => {
      const landmarks: Coords3D = prediction.landmarks;

    //   // Loop through each finger
    //   Object.keys(fingerJoints).forEach((finger) => {
    //     const points = fingerJoints[finger as keyof FingerJointsType];
    //     for (let k = 0; k < points.length - 1; k++) {
    //         console.log("here");
    //       const firstJointIndex = points[k];
    //       const secondJointIndex = points[k + 1];

    //       ctx.beginPath();
    //       ctx.moveTo(landmarks[firstJointIndex][0], landmarks[firstJointIndex][1]);
    //       ctx.lineTo(landmarks[secondJointIndex][0], landmarks[secondJointIndex][1]);
    //       ctx.strokeStyle = "plum";
    //       ctx.lineWidth = 4;
    //       ctx.stroke();
    //     }
    //   });

      // Draw each landmark point

      for(let i =0; i < landmarks.length; i++){
        console.log("drawing")
        const x: number = landmarks[i][0];
        const y: number = landmarks[i][1];
        ctx.beginPath();
        ctx.arc(x, y, 5, 0, 3 * Math.PI);
        ctx.fillStyle = "indigo";
        ctx.fill();
      }
    //   landmarks.forEach(([x, y], i) => {
    //     console.log("drawing")
        
    //   });
    });
  }
};
