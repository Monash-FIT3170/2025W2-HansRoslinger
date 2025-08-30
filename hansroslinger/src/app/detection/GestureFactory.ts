import { OpenPalm, Pinch, PointUp, DoublePinch } from "./Gesture";

export function GestureFactory(name: string) {
  switch (name) {
    case "Open_Palm":
      return new OpenPalm();
    case "Pinch":
      return new Pinch();
    case "DoublePinch":
      return new DoublePinch();
    case "Pointing_Up":
      return new PointUp();
  }
}
