import { GestureRecognizerResult } from "@mediapipe/tasks-vision";
import {
  DOUBLE_PINCH,
  OPEN_PALM,
  PINCH,
  POINT_UP,
} from "constants/application";
import { GestureType } from "types/application";

interface GesturePayload {
  name: GestureType;
  points: {
    [name: string]: {
      x: number;
      y: number;
    };
  };
}
abstract class Gesture {
  name: string;

  constructor(name: string) {
    this.name = name;
  }

  detect?(landmarks: GestureRecognizerResult): boolean;

  abstract payload(
    hand: number,
    landmarks: GestureRecognizerResult,
    canvas: HTMLCanvasElement,
  ): GesturePayload;
}

class OpenPalm extends Gesture {
  constructor() {
    super(OPEN_PALM);
  }

  payload(
    hand: number,
    landmarks: GestureRecognizerResult,
    canvas: HTMLCanvasElement,
  ) {
    const wrist = landmarks.landmarks[hand][0];
    const middleBase = landmarks.landmarks[hand][9];
    const palmCenterY = canvas.height * ((wrist.y + middleBase.y) / 2);
    const palmCenterX = canvas.width - canvas.width * wrist.x;
    return {
      name: this.name,
      points: { palmCenter: { x: palmCenterX, y: palmCenterY } },
    };
  }
}

class PointUp extends Gesture {
  constructor() {
    super(POINT_UP);
  }

  payload(
    hand: number,
    landmarks: GestureRecognizerResult,
    canvas: HTMLCanvasElement,
  ) {
    const indexFingerTip = landmarks.landmarks[hand][8];
    const indexFingerY = canvas.height * indexFingerTip.y;
    const indexFingerX = canvas.width * indexFingerTip.x;

    return {
      name: this.name,
      points: { indexFingerTip: { x: indexFingerX, y: indexFingerY } },
    };
  }
}

class Pinch extends Gesture {
  constructor() {
    super(PINCH);
  }

  payload(
    hand: number,
    landmarks: GestureRecognizerResult,
    canvas: HTMLCanvasElement,
  ) {
    const thumbTip = landmarks.landmarks[hand][4];
    const indexTip = landmarks.landmarks[hand][8];

    const pinchPointX =
      canvas.width - canvas.width * ((thumbTip.x + indexTip.x) / 2);
    const pinchPointY = canvas.height * ((thumbTip.y + indexTip.y) / 2);

    return {
      name: this.name,
      points: { pinchPoint: { x: pinchPointX, y: pinchPointY } },
    };
  }
}

class DoublePinch extends Gesture {
  constructor() {
    super(DOUBLE_PINCH);
  }

  payload(
    hand: number,
    landmarks: GestureRecognizerResult,
    canvas: HTMLCanvasElement,
  ) {
    const pinch1 = new Pinch().payload(0, landmarks, canvas);
    const pinch2 = new Pinch().payload(1, landmarks, canvas);

    return {
      name: this.name,
      points: {
        pinchPoint1: pinch1.points.pinchPoint,
        pinchPoint2: pinch2.points.pinchPoint,
      },
    };
  }
}

export { Gesture, Pinch, PointUp, OpenPalm, DoublePinch };
export type { GesturePayload };
