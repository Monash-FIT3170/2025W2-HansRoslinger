import { DOUBLE_PINCH, HOVER, MOVE, OPEN_PALM, PINCH, RESIZE } from "constants/application";
import { ActionType, GestureType } from "types/application";

export const gestureToActionMap: Record<GestureType, ActionType> = {
  [PINCH]: MOVE,
  [DOUBLE_PINCH]: RESIZE,
  [OPEN_PALM]: HOVER,
};