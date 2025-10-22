import { GestureRecognizerResult } from "@mediapipe/tasks-vision";
import {
  DOUBLE_PINCH,
  LEFT_RIGHT,
  OPEN_PALM,
  PINCH,
  POINT_UP,
  CLOSED_FIST,
} from "constants/application";
import { GestureType, HandIds } from "types/application";

interface GesturePayload {
  id: HandIds;
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
    const indexFingerTip = landmarks.landmarks[hand][8];
    const indexFingerY = canvas.height * indexFingerTip.y;
    const indexFingerX = canvas.width - canvas.width * indexFingerTip.x;

    return {
      id: landmarks.handedness[hand][0].displayName.toLocaleLowerCase(),
      name: this.name,
      points: {
        indexFingerTip: { x: indexFingerX, y: indexFingerY },
        palmCenter: { x: palmCenterX, y: palmCenterY },
      },
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
    const indexFingerX = canvas.width - canvas.width * indexFingerTip.x;

    return {
      id: landmarks.handedness[hand][0].displayName.toLocaleLowerCase(),
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
      id: landmarks.handedness[hand][0].displayName.toLocaleLowerCase(),
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
      id: LEFT_RIGHT,
      name: this.name,
      points: {
        pinchPoint1: pinch1.points.pinchPoint,
        pinchPoint2: pinch2.points.pinchPoint,
      },
    };
  }
}

class ClosedFist extends Gesture {
  constructor() {
    super(CLOSED_FIST);
  }

  private palmCenter(hand: number, landmarks: GestureRecognizerResult) {
    const lm = landmarks.landmarks?.[hand];
    // Fallback to wrist if landmarks missing
    if (!lm || lm.length < 18) return { x: 0.5, y: 0.5 };

    const idx = [0, 5, 9, 13, 17];
    let sx = 0,
      sy = 0;
    for (const i of idx) {
      sx += lm[i].x;
      sy += lm[i].y;
    }
    const n = idx.length;
    return { x: sx / n, y: sy / n }; // normalized [0..1]
  }

  payload(
    hand: number,
    landmarks: GestureRecognizerResult,
    canvas: HTMLCanvasElement,
  ): GesturePayload {
    const center = this.palmCenter(hand, landmarks);

    const fistPointX = canvas.width - canvas.width * center.x;
    const fistPointY = canvas.height * center.y;

    return {
      id: landmarks.handedness[hand][0].displayName.toLowerCase() as HandIds,
      name: this.name as GestureType,
      points: {
        fistPoint: { x: fistPointX, y: fistPointY },
      },
    };
  }
}

export { Gesture, Pinch, PointUp, OpenPalm, DoublePinch, ClosedFist };
export type { GesturePayload };
