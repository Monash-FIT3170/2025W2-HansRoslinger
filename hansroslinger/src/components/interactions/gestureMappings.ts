import {
  DOUBLE_PINCH,
  HOVER,
  MOVE,
  OPEN_PALM,
  PINCH,
  POINT_UP,
  RESIZE,
  VEGA_INTERACTION,
} from "constants/application";
import { ActionType, GestureType } from "types/application";

export const gestureToActionMap: Record<GestureType, ActionType> = {
  [PINCH]: MOVE,
  [DOUBLE_PINCH]: RESIZE,
  [OPEN_PALM]: HOVER,
  [POINT_UP]: VEGA_INTERACTION,
};
